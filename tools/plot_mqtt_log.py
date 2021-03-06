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
print args

# Look only at .log files in specified folder
# file format: <num nodes>-<tps>-<# msgs>-<same/diff broker>.log

files = [join(args.folder, f) for f in listdir(args.folder)
         if isfile(join(args.folder, f)) and f.endswith('.log') and
         len(f.split('-')) >= 4]

# broker -> tps -> [(# nodes, e2e_delay)]
data = {
    's': defaultdict(list),
    'd': defaultdict(list)
}

data_local = {
    's': defaultdict(list),
    'd': defaultdict(list)
}

min_nodes = 100
max_nodes = 0

# Parse log files
for filename in files:
    e2e_queue = Queue.Queue()
    local_queue = Queue.Queue()

    e2e_duration = 0
    e2e_count = 0

    local_duration = 0
    local_count = 0

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
            line = line.rstrip()

            tokens = line.split(' ', 2)

            timestamp = int(tokens[0])  #ms
            topic = tokens[1]

            if (topic.endswith('_verified')):
                # Verified message
                e2e_duration += timestamp - e2e_queue.get()
                e2e_count += 1

            elif (topic.endswith('_sent')):
                # Published message
                e2e_queue.put(timestamp)
                local_queue.put(timestamp)

            else:
                # Subscribed message
                local_duration += timestamp - local_queue.get()
                local_count += 1


    e2e_delay = e2e_duration/e2e_count/1000
    local_delay = local_duration/local_count/1000

    print filename, e2e_delay, e2e_count, local_delay, local_count

    data[broker][tps].append((num_nodes, e2e_delay))
    data_local[broker][tps].append((num_nodes, local_delay))

# Generate plots
def plot_lines(tag, title):
    lines = data[tag].keys()
    lines.sort()

    for l in lines:
        d = sorted(data[tag][l])
        d_local = sorted(data_local[tag][l])

        x, y = zip(*d)
        x = list(x)
        y = list(y)

        x_local, y_local = zip(*d_local)
        x_local = list(x_local)
        y_local = list(y_local)

        plt.plot(x, y, '.-', label=str(l) + ' TX/s (committed)')
        plt.plot(x_local, y_local, '.-', label=str(l) + ' TX/s (loopback)')

    plt.xlim(min_nodes, max_nodes)
    plt.legend()
    plt.xlabel('# Nodes')
    plt.ylabel('Delay (s)')
    plt.title(title)
    plt.show()

if args.p:
    plt.figure(0)
    plot_lines('s', 'End-to-end Delay at Same Broker')

    plt.figure(1)
    plot_lines('d', 'End-to-end Delay Across Different Brokers')
