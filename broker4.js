# This is a TOML config file.
# For more information, see https://github.com/toml-lang/toml

##### main base config options #####

# TCP or UNIX socket address of the ABCI application,
# or the name of an ABCI application compiled in with the Tendermint binary
proxy_app = "tcp://127.0.0.1:46658"

# A custom human readable name for this node
moniker = "rpi48"

# If this node is many blocks behind the tip of the chain, FastSync
# allows them to catchup quickly by downloading blocks in parallel
# and verifying their commits
fast_sync = true

# Database backend: leveldb | memdb
db_backend = "leveldb"

# Database directory
db_path = "data"

# Output level for logging, including package level options
log_level = "main:info,state:info,*:error"

##### additional base config options #####

chain_id="test-chain-GwUwsc"

# Path to the JSON file containing the initial validator set and other meta data
genesis_file = "config/genesis.json"

# Path to the JSON file containing the private key to use as a validator in the consensus protocol
priv_validator_file = "config/priv_validator.json"

# Path to the JSON file containing the private key to use for node authentication in the p2p protocol
node_key_file = "config/node_key.json"

# Mechanism to connect to the ABCI application: socket | grpc
abci = "socket"

# TCP or UNIX socket address for the profiling server to listen on
prof_laddr = ""

# If true, query the ABCI app on connecting to a new peer
# so the app can decide if we should keep the connection or not
filter_peers = false

##### advanced configuration options #####

##### rpc server configuration options #####
[rpc]

# TCP or UNIX socket address for the RPC server to listen on
laddr = "tcp://0.0.0.0:46657"

# TCP or UNIX socket address for the gRPC server to listen on
# NOTE: This server only supports /broadcast_tx_commit
grpc_laddr = ""

# Activate unsafe RPC commands like /dial_seeds and /unsafe_flush_mempool
unsafe = false

##### peer to peer configuration options #####
[p2p]

# Address to listen for incoming connections
laddr = "tcp://0.0.0.0:46656"

# Comma separated list of seed nodes to connect to
seeds = """fd208d4af60c673d5a6eb5491952de11f6eee66b@192.168.1.138:46656, \
                    ff5e56c60cfdfd91114c34917ea55c7687589011@192.168.1.134:46656, \
                    1a9b562afdc45dc8795a5f7edc9d4bd496c5f8f6@192.168.1.135:46656, \
                    a105678e3cbec9e29bc4b0c85ccb15593ae61073@192.168.1.136:46656, \
                    88b1f3ba2e4e710767521639c86b184796620edf@192.168.1.137:46656, """

# Comma separated list of nodes to keep persistent connections to
# Do not add private peers to this list if you don't want them advertised
# persistent_peers for 20 nodes (33-52)
persistent_peers = """fd208d4af60c673d5a6eb5491952de11f6eee66b@192.168.1.138:46656, \
                    ff5e56c60cfdfd91114c34917ea55c7687589011@192.168.1.134:46656, \
                    1a9b562afdc45dc8795a5f7edc9d4bd496c5f8f6@192.168.1.135:46656, \
                    a105678e3cbec9e29bc4b0c85ccb15593ae61073@192.168.1.136:46656, \
                    88b1f3ba2e4e710767521639c86b184796620edf@192.168.1.137:46656,  """

# Path to address book
addr_book_file = "config/addrbook.json"

# Set true for strict address routability rules
addr_book_strict = true

# Time to wait before flushing messages out on the connection, in ms
flush_throttle_timeout = 100

# Maximum number of peers to connect to
max_num_peers = 50

# Maximum size of a message packet payload, in bytes
max_packet_msg_payload_size = 1024

# Rate at which packets can be sent, in bytes/second
send_rate = 512000

# Rate at which packets can be received, in bytes/second
recv_rate = 512000

# Set true to enable the peer-exchange reactor
pex = false

# Seed mode, in which node constantly crawls the network and looks for
# peers. If another node asks it for addresses, it responds and disconnects.
#
# Does not work if the peer-exchange reactor is disabled.
seed_mode = false

# Authenticated encryption
auth_enc = true

# Comma separated list of peer IDs to keep private (will not be gossiped to other peers)
private_peer_ids = ""

##### mempool configuration options #####
[mempool]

recheck = true
recheck_empty = true
broadcast = true
wal_dir = "data/mempool.wal"

# size of the mempool
size = 100000

# size of the cache (used to filter transactions we saw earlier)
cache_size = 100000

##### consensus configuration options #####
[consensus]

wal_file = "data/cs.wal/wal"

# All timeouts are in milliseconds
timeout_propose = 3000
timeout_propose_delta = 500
timeout_prevote = 1000
timeout_prevote_delta = 500
timeout_precommit = 1000
timeout_precommit_delta = 500
timeout_commit = 1000

# Make progress as soon as we have all the precommits (as if TimeoutCommit = 0)
skip_timeout_commit = false

# BlockSize
max_block_size_txs = 10000
max_block_size_bytes = 1

# EmptyBlocks mode and possible interval between empty blocks in seconds
create_empty_blocks = false
create_empty_blocks_interval = 60

# Reactor sleep duration parameters are in milliseconds
peer_gossip_sleep_duration = 100
peer_query_maj23_sleep_duration = 2000

##### transactions indexer configuration options #####
[tx_index]

# What indexer to use for transactions
#
# Options:
#   1) "null" (default)
#   2) "kv" - the simplest possible indexer, backed by key-value storage (defaults to levelDB; see DBBackend).
indexer = "kv"

# Comma-separated list of tags to index (by default the only tag is tx hash)
#
# It's recommended to index only a subset of tags due to possible memory
# bloat. This is, of course, depends on the indexer's DB and the volume of
# transactions.
index_tags = ""

# When set to true, tells indexer to index all tags. Note this may be not
# desirable (see the comment above). IndexTags has a precedence over
# IndexAllTags (i.e. when given both, IndexTags will be indexed).
index_all_tags = false