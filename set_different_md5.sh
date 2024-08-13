#!/bin/bash

# 检查参数是否为空
if [ $# -eq 0 ]; then
  echo "Usage: $0 <directory>"
  exit 1
fi

# 获取目录参数
directory=$1

# 检查目录是否存在
if [ ! -d "$directory" ]; then
  echo "Error: Directory '$directory' does not exist."
  exit 1
fi

# 进入目录
cd "$directory" || exit 1

# 获取当前时间戳
timestamp=$(date +"%Y-%m-%d %H:%M:%S")

# 循环处理目录下的每个FLAC文件
for file in *.flac; do
  if [ -f "$file" ]; then
    # 添加 FROM=LW404 和 TIMESTAMP 标签
    metaflac --remove-all-tags "$file"
    metaflac --set-tag=FROM=LW404 "$file"
    metaflac --set-tag=TIMESTAMP="$timestamp" "$file"

    # 计算文件的MD5值
    md5sum=$(md5 -q "$file")

    echo "Modified MD5 for $file: $md5sum"
  fi
done
