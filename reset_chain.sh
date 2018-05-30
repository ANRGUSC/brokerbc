#/bin/sh
###Remove the data folder to delete the old chain data and reset the chain
rm -rf /home/pirate/.tendermint/data/ && tendermint unsafe_reset_priv_validator && rm -rf ./data/
