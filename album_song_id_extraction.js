// ==UserScript==
// @name         网易云音乐专辑歌曲信息提取
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  提取专辑的歌曲信息并显示在可拖拽和调整大小的窗口中，并提供复制和填充功能
// @author       lw404-ai
// @match        https://music.163.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 创建可拖拽和调整大小的窗口
    var bkcontainer = document.createElement("div");
    bkcontainer.style.position = "fixed";
    bkcontainer.style.top = "20px";
    bkcontainer.style.left = "20px";
    bkcontainer.style.width = "200px";
    bkcontainer.style.height = "50px";
    bkcontainer.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    bkcontainer.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    bkcontainer.style.borderRadius = "10px";
    bkcontainer.style.zIndex = 1000;
    bkcontainer.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    document.body.appendChild(bkcontainer);

    // 创建输入框容器
    var inputContainer = document.createElement("div");
    inputContainer.style.display = "flex";
    inputContainer.style.alignItems = "center";
    inputContainer.style.padding = "10px";
    bkcontainer.appendChild(inputContainer);

    var inputLabel = document.createElement("label");
    inputLabel.innerText = "专辑ID:";
    inputLabel.style.marginRight = "10px";
    inputContainer.appendChild(inputLabel);

    var albumIdInput = document.createElement("input");
    albumIdInput.type = "text";
    albumIdInput.style.padding = "5px";
    albumIdInput.style.width = "60px";
    albumIdInput.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    albumIdInput.style.borderRadius = "5px";
    albumIdInput.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
    inputContainer.appendChild(albumIdInput);

    // 创建按钮
    var button = document.createElement("button");
    button.innerHTML = "获取";
    button.style.marginLeft = "10px";
    button.style.padding = "5px 10px";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.background = "linear-gradient(45deg, #6fb1fc, #4364f7)";
    button.style.color = "white";
    button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    button.style.transition = "background 0.3s, box-shadow 0.3s";
    button.style.animation = "breathing 2s ease-in-out infinite";
    inputContainer.appendChild(button);

    // 呼吸渐变特效
    var style = document.createElement('style');
    style.innerHTML = `
        @keyframes breathing {
            0% {
                box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
            }
            50% {
                box-shadow: 0 0 50px rgba(0, 0, 0, 0.4);
            }
            100% {
                box-shadow: 0 0 25px rgba(0, 0, 0, 0.2);
            }
        }
        button:active {
            transform: scale(0.95);
        }
    `;
    document.head.appendChild(style);

    // 创建可拖拽和调整大小的窗口
    var container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "90px";
    container.style.left = "4.5px";
    container.style.width = "220px";
    container.style.height = "450px";
    container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    container.style.border = "1px solid rgba(0, 0, 0, 0.1)";
    container.style.borderRadius = "10px";
    container.style.zIndex = 1000;
    container.style.display = "none";
    container.style.resize = "both";
    container.style.overflow = "auto";
    container.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
    document.body.appendChild(container);

    var header = document.createElement("div");
    header.style.padding = "10px";
    header.style.cursor = "move";
    header.style.backgroundColor = "#2196F3";
    header.style.color = "white";
    header.style.borderTopLeftRadius = "10px";
    header.style.borderTopRightRadius = "10px";
    header.innerHTML = "<b>歌曲信息</b>";
    container.appendChild(header);

    // 创建关闭按钮
    var closeButton = document.createElement("button");
    closeButton.innerHTML = "关";
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "5px";
    closeButton.style.padding = "2px 5px";
    closeButton.style.border = "none";
    closeButton.style.borderRadius = "5px";
    closeButton.style.background = "red";
    closeButton.style.color = "white";
    closeButton.style.cursor = "pointer";
    closeButton.onclick = function() {
        container.style.display = "none";
    };
    container.appendChild(closeButton);

    // 创建内容显示区域
    var content = document.createElement("div");
    content.style.padding = "10px";
    container.appendChild(content);

    // 使窗口可拖动
    header.onmousedown = function(event) {
        event.preventDefault();
        document.onmousemove = function(event) {
            container.style.top = (event.clientY - header.clientHeight / 2) + "px";
            container.style.left = (event.clientX - header.clientWidth / 2) + "px";
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        };
    };

    // 获取歌曲信息
    button.onclick = function() {
        var albumId = albumIdInput.value.trim();
        if (albumId === "") {
            alert("请输入有效的专辑ID");
            return;
        }

        fetch(`https://music.163.com/api/album/${albumId}`)
            .then(response => response.json())
            .then(data => {
                var songs = data.album.songs;
                var table = document.createElement("table");
                table.style.width = "100%";
                table.style.borderCollapse = "collapse";

                var headerRow = document.createElement("tr");
                var nameHeader = document.createElement("th");
                nameHeader.innerText = "歌曲名称";
                nameHeader.style.border = "1px solid rgba(0, 0, 0, 0.1)";
                var idHeader = document.createElement("th");
                idHeader.innerText = "歌曲ID";
                idHeader.style.border = "1px solid rgba(0, 0, 0, 0.1)";
                var actionHeader = document.createElement("th");
                actionHeader.innerText = "操作";
                actionHeader.style.border = "1px solid rgba(0, 0, 0, 0.1)";
                headerRow.appendChild(nameHeader);
                headerRow.appendChild(idHeader);
                headerRow.appendChild(actionHeader);
                table.appendChild(headerRow);

                songs.forEach(song => {
                    var row = document.createElement("tr");
                    var nameCell = document.createElement("td");
                    nameCell.innerText = song.name;
                    nameCell.style.border = "1px solid rgba(0, 0, 0, 0.1)";
                    nameCell.style.padding = "5px";
                    var idCell = document.createElement("td");
                    idCell.innerText = song.id;
                    idCell.style.border = "1px solid rgba(0, 0, 0, 0.1)";
                    idCell.style.padding = "5px";

                    // 创建复制按钮
                    var copyButton = document.createElement("button");
                    copyButton.innerText = "复制";
                    copyButton.style.margin = "0 5px";
                    copyButton.style.padding = "5px 10px";
                    copyButton.style.border = "none";
                    copyButton.style.borderRadius = "5px";
                    copyButton.style.background = "linear-gradient(45deg, #f77062, #fe5196)";
                    copyButton.style.color = "white";
                    copyButton.style.transition = "background 0.3s";
                    copyButton.onclick = function() {
                        navigator.clipboard.writeText(song.id).then(function() {
                            copyButton.style.background = "linear-gradient(45deg, #34e89e, #0f3443)";
                        }, function(err) {
                            console.error("复制失败: ", err);
                        });
                    };

                    var actionCell = document.createElement("td");
                    actionCell.style.border = "1px solid rgba(0, 0, 0, 0.1)";
                    actionCell.style.padding = "5px";
                    actionCell.style.textAlign = "center";
                    actionCell.appendChild(copyButton);

                    row.appendChild(nameCell);
                    row.appendChild(idCell);
                    row.appendChild(actionCell);
                    table.appendChild(row);
                });

                content.innerHTML = "";
                content.appendChild(table);
                container.style.display = "block";
            })
            .catch(error => {
                console.error('Error fetching the album:', error);
                alert("获取专辑信息失败，请检查专辑ID是否正确。");
            });
    };
})();
