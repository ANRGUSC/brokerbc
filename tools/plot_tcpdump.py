#!/usr/bin/env python
from __future__ import division

import argparse
import Queue
import matplotlib.pyplot as plt

from collections import defaultdict
from os import listdir
from os.path import isfile, join

# Command line arguments
parser = argparse.ArgumentParser(
    description='Plot data from MQTT probe log')

parser.add_argument('folder',
                    help='folder to process')

parser.add_argument('-p', action='store_true',
                    help='plot')

parser.add_argument('-v', action='store_true',
                    help='verbose')

args = parser.parse_args()
#print args

# Look only at .log files in specified folder
# file format: <num nodes>-<tps>-<# msgs>-<same/diff broker>.log

files = [join(args.folder, f) for f in listdir(args.folder)
         if isfile(join(args.folder, f)) and f.endswith('.tcpdump') and
         len(f.split('-')) >= 4]

# broker -> tps -> [(# nodes, traffic)]
data = {
    's': defaultdict(list),
    'd': defaultdict(list)
}

min_nodes = 100
max_nodes = 0

# Parse log files
for filename in files:
    start = 0
    finish = 0
    transferred = 0

    parameters = filename.split('-')

    num_nodes = int(parameters[0].split('/')[-1])
    tps = int(parameters[1])
    num_msgs = int(parameters[2])
    broker = parameters[3][0]

    if args.v:
        print num_nodes, tps, num_msgs, broker

    min_nodes = min(num_nodes, min_nodes)
    max_nodes = max(num_nodes, max_nodes)

    with open(filename) as f:
        for line in f:
            # skip secondary lines
            if line[0].isspace():
                continue

            line = line.rstrip()

            tokens = line.split(' ')

            timestamp = float(tokens[0])
            length = int(tokens[16][:-1])

            # capture start time
            if start == 0:
                start = timestamp

            finish = timestamp
            transferred += length   #bytes

            #print timestamp, length

    duration = finish - start
    data[broker][tps].append((num_nodes, transferred/1e6))

# Generate plots
def plot_lines(tag, title):
    lines = data[tag].keys()
    lines.sort()

    for l in lines:
        d = sorted(data[tag][l])

        x, y = zip(*d)
        x = list(x)
        y = list(y)

        plt.plot(x, y, '.-', label=str(l) + ' TX/s')

    plt.xlim(min_nodes, max_nodes)
    plt.legend()
    plt.xlabel('# Nodes')
    plt.ylabel('Traffic (MB)')
    plt.title(title)
    plt.show()

if args.p:
    plt.figure(0)
    plot_lines('s', 'Network Activity')

    plt.figure(1)
    plot_lines('d', 'Network Activity (Different Brokers)')
