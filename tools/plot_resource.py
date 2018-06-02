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
         if isfile(join(args.folder, f)) and f.endswith('.resource') and
         len(f.split('-')) >= 4]

# broker -> tps -> [(# nodes, traffic)]
cpu_data = {
    's': defaultdict(list),
    'd': defaultdict(list)
}

mem_data = {
    's': defaultdict(list),
    'd': defaultdict(list)
}

min_nodes = 100
max_nodes = 0

# Parse log files
for filename in files:
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
            if line[0] == '%':
                continue

            line = line.rstrip()
            tokens = line.split()

            cpu = float(tokens[0])
            mem = float(tokens[1]) * 1024

    cpu_data[broker][tps].append((num_nodes, cpu))
    mem_data[broker][tps].append((num_nodes, mem))

# Generate plots
def plot_lines(data, title, ylabel):
    lines = data['s'].keys()
    lines.sort()

    for l in lines:
        d = sorted(data['s'][l])

        x, y = zip(*d)
        x = list(x)
        y = list(y)

        plt.plot(x, y, '.-', label=str(l) + ' TX/s')

    plt.xlim(min_nodes, max_nodes)
    plt.legend()
    plt.xlabel('# Nodes')
    plt.ylabel(ylabel)
    plt.title(title)
    plt.show()

if args.p:
    plt.figure(0)
    plot_lines(cpu_data, 'CPU Usage', '% CPU')

    plt.figure(1)
    plot_lines(mem_data, 'Memory Usage', 'Memory (MB)')
