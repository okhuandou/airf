#!/bin/bash

#fname=billStat.game-2018-09-27_0.log

if [[ $# != 1 ]]; then
  echo "usage yyyy-mm-dd"
  exit 1
fi

cp /data/bill/aircraft/billStat.game-${1}*log.gz ./aircraft/
cp /data/bill/aircraft2/billStat.game-${1}*log.gz ./aircraft2/

gunzip ./aircraft/billStat.game-${1}*log.gz
gunzip ./aircraft2/billStat.game-${1}*log.gz

cat ./aircraft/billStat.game-${1}_0.log > billStat.game-${1}.log

if [[ -f ./aircraft2/billStat.game-${1}_0.log ]]; then
  cat ./aircraft2/billStat.game-${1}_0.log >> billStat.game-${1}.log
fi


fname=billStat.game-${1}.log

cat $fname | grep user | awk -F\| '{print $6}' | sort | uniq -c | awk '{print $2" "$1}'
echo "新增"
echo ""

cat $fname | grep -E "login|user" | awk -F\| '{print $2"|"$6}' | sort | uniq | awk -F\| '{print $2}' | sort | uniq -c | awk '{print $2" "$1}'
echo "活跃（包括新增）"
echo ""
