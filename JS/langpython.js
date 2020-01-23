/* 共通部分のHTMLファイルの読み込み */
$(function header() {
  $('#header').load('header.html');
});

/* eslint-disable linebreak-style */
// 保存する二次元配列sortitem.識別子conlist.条件式
const sortitem = new Array(15).fill(null).map(() => new Array(5).fill(null));
const conlist = new Array(15).fill(null).map(() => new Array(5).fill(null));

$(function() {
  // 表作成
  const rend = 15; // 行
  const cend = 5; // 列
  const tableJQ = $('<table cellpadding="15" bordercolor="#37a1e5"> <tbody>');
  for (let r = 0; r < rend; r++) {
    const trJQr = $('<tr></tr>').appendTo(tableJQ);
    for (let c = 0; c < cend; c++) {
      $('<td class="table" id="table' + r + '_' + c + '"></td>').appendTo(
        trJQr,
      );
    }
  }
  $('#tableid').append(tableJQ);
});
$(function() {
  // ソート
  let subcon = null;
  $('.table').sortable({
    placeholder: 'ui-state-highlight',
    forcePlaceholderSize: true,
    connectWith: '.table',
    revert: true,
    update: function() {
      const rend = 15; // 行
      const cend = 5; // 列
      for (let r = 0; r < rend; r++) {
        for (let c = 0; c < cend; c++) {
          const table = 'table' + r + '_' + c;
          const sub = $('#' + table).sortable('toArray');
          if (sub[0] != undefined) {
            sortitem[r][c] = sub[0];
          } else {
            sortitem[r][c] = null;
          }
        }
      }
      $.ajax({
        // POST通信
        type: 'POST',
        data: {
          module: sortitem,
          string: conlist,
        },
        // ここでデータの送信先URLを指定します。
        url: 'P_Conversion.php',
      }).done(function(response) {
        $('#pro').html(response);
      });

      // 線を引く
      const leadlist = new Array(15)
        .fill(null)
        .map(() => new Array(5).fill(null));
      let cnt = 0;
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 5; j++) {
          subid = 'table' + i + '_' + j;
          $('#' + subid)
            .has('svg')
            .each(function() {
              const svElement = document.getElementById(subid);
              leadlist[i][j] = svElement.firstElementChild;
              cnt += 1;
            });
        }
      }

      const linearray = new Array(500).fill(null);
      if (cnt >= 2) {
        $('.leader-line').remove();
      }
      let linecnt = 0;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 15; j++) {
          if (leadlist[j][i] != null) {
            for (let z = j + 1; z < 15; z++) {
              if (leadlist[z][i] != null) {
                linearray[linecnt] = new LeaderLine(
                  leadlist[j][i],
                  leadlist[z][i],
                );
                linecnt += 1;
                break;
              }
            }
          }
        }
      }
      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 5; j++) {
          if (
            (sortitem[i][j] == '8' || sortitem[i][j] == '9') &&
            leadlist[i][j + 1] != null
          ) {
            linearray[linecnt] = new LeaderLine(
              leadlist[i][j],
              leadlist[i][j + 1],
            );
            linecnt += 1;
          }
          if (sortitem[i][j] == '10' && j >= 1) {
            for (let g = i + 1; g < i + 2; g++) {
              if (sortitem[g][j - 1] == '11') {
                linearray[linecnt] = new LeaderLine(
                  leadlist[i][j],
                  leadlist[g][j - 1],
                );
                linecnt += 1;
              }
            }
          }
        }
      }
      for (let i = 0; i < linecnt; i++) {
        document.getElementById('tableid').addEventListener(
          'scroll',
          AnimEvent.add(function() {
            linearray[i].position();
          }),
          false,
        );
        document.getElementById('flowid').addEventListener(
          'scroll',
          AnimEvent.add(function() {
            linearray[i].position();
          }),
          false,
        );
      }
    },
    remove: function() {
      const rend = 15; // 行
      const cend = 5; // 列
      const removeid = $(this).attr('id');
      for (let r = 0; r < rend; r++) {
        for (let c = 0; c < cend; c++) {
          const ifid = 'table' + r + '_' + c;
          if (ifid == removeid) {
            subcon = conlist[r][c];
            conlist[r][c] = null;
          }
        }
      }
    },

    receive: function() {
      const con = $(this).attr('id');
      const i = con.substr(5, 1);
      const j = con.substr(7, 1);
      conlist[i][j] = subcon;
    },
  });

  // ドラッグ
  $('#sort').sortable({
    connectWith: '.table',
    containment: 'body',
    helper: 'clone',
    revert: true,
    placeholder: 'ui-state-highlight',
    start: function(event, ui) {
      $(ui.item).show();
      clone = $(ui.item).clone();
      before = $(ui.item).prev();
      parent = $(ui.item).parent();
      newItem = $(ui.item).attr('id');
    },
    remove: function(event, ui) {
      subtitle = $(ui.item).attr('title');
      if (before.length) before.after(clone);
      else {
        parent.prepend(clone);
      }
      ui.item.attr('id', newItem);
      ui.item.addClass('context-menu-one');
      ui.item.addClass('lead-line-list');
      ui.item.attr('title', '条件式が入力されていません。');
    },
  });
});
// 右クリックメニュー
$(function() {
  $.contextMenu({
    selector: '.context-menu-one',
    items: {
      edit: {
        name: '条件編集',
        icon: 'edit',
        callback: function(key, opt) {
          svg = $(this);
          // 条件編集のID取得
          // 条件編集のID取得
          const tableid = opt.$trigger.parent().attr('id');
          const cpid = opt.$trigger.attr('id');
          const formid = 'form_' + cpid;
          const inputid = 'input_' + cpid;
          // 条件入力フォーム
          $('#' + formid).dialog({
            modal: true, // モーダル
            title: '入力フォーム',
            width: '72vw',
            heighth: '40vh',
            buttons: {
              ok: {
                text: '確認',
                id: 'okbtnid',
                click: function(event, ui) {
                  const conditions = document.forms[formid][inputid].value;
                  document[formid].reset();
                  const rend = 15; // 行
                  const cend = 5; // 列
                  for (let r = 0; r < rend; r++) {
                    for (let c = 0; c < cend; c++) {
                      ret = 'table' + r + '_' + c;
                      if (tableid == ret) {
                        conlist[r][c] = conditions;
                        $(svg).attr('title', conditions);
                      }
                    }
                  }
                  $.ajax({
                    // POST通信
                    type: 'POST',
                    data: {
                      module: sortitem,
                      string: conlist,
                    },
                    // ここでデータの送信先URLを指定します。
                    url: 'P_Conversion.php',
                  }).done(function(response) {
                    $('#pro').html(response);
                  });
                  $(this).dialog('close');
                },
              },
              cancel: {
                text: 'キャンセル',
                id: 'cancelbtnid',
                click: function() {
                  $(this).dialog('close');
                },
              },
            },
            open: function() {
              $(document).keydown(function(event) {
                if (event.keyCode == 13) {
                  event.preventDefault();
                  $('#okbtnid').click;
                }
              });
            },
          });
        },
      },
      // 削除する
      delete: {
        name: '消去',
        icon: 'delete',
        callback: function(key, opt) {
          // 削除するID取得
          if (confirm('本当に削除しますか？')) {
            deleteid = opt.$trigger.parent().attr('id');
            $('#' + deleteid).empty();
            for (let r = 0; r < 15; r++) {
              for (let c = 0; c < 5; c++) {
                ret = 'table' + r + '_' + c;
                if (deleteid == ret) {
                  conlist[r][c] = null;
                  sortitem[r][c] = null;
                }
              }
            }
            $.ajax({
              // POST通信
              type: 'POST',
              data: {
                module: sortitem,
                string: conlist,
              },
              // ここでデータの送信先URLを指定します。
              url: 'P_Conversion.php',
            }).done(function(response) {
              $('#pro').html(response);
            });

            // 線を引く
            const leadlist = new Array(15)
              .fill(null)
              .map(() => new Array(5).fill(null));
            let cnt = 0;
            for (let i = 0; i < 15; i++) {
              for (let j = 0; j < 5; j++) {
                subid = 'table' + i + '_' + j;
                $('#' + subid)
                  .has('svg')
                  .each(function() {
                    const svElement = document.getElementById(subid);
                    leadlist[i][j] = svElement.firstElementChild;
                    cnt += 1;
                  });
              }
            }

            const linearray = new Array(500).fill(null);
            if (cnt >= 1) {
              $('.leader-line').remove();
            }
            let linecnt = 0;
            for (let i = 0; i < 5; i++) {
              for (let j = 0; j < 15; j++) {
                if (leadlist[j][i] != null) {
                  for (let z = j + 1; z < 15; z++) {
                    if (leadlist[z][i] != null) {
                      linearray[linecnt] = new LeaderLine(
                        leadlist[j][i],
                        leadlist[z][i],
                      );
                      linecnt += 1;
                      break;
                    }
                  }
                }
              }
            }
            for (let i = 0; i < 15; i++) {
              for (let j = 0; j < 5; j++) {
                if (
                  (sortitem[i][j] == '8' || sortitem[i][j] == '9') &&
                  leadlist[i][j + 1] != null
                ) {
                  linearray[linecnt] = new LeaderLine(
                    leadlist[i][j],
                    leadlist[i][j + 1],
                  );
                  linecnt += 1;
                }
                if (sortitem[i][j] == '10' && j >= 1) {
                  for (let g = i + 1; g < i + 2; g++) {
                    if (sortitem[g][j - 1] == '11') {
                      linearray[linecnt] = new LeaderLine(
                        leadlist[i][j],
                        leadlist[g][j - 1],
                      );
                      linecnt += 1;
                    }
                  }
                }
              }
            }
            for (let i = 0; i < linecnt; i++) {
              document.getElementById('tableid').addEventListener(
                'scroll',
                AnimEvent.add(function() {
                  linearray[i].position();
                }),
                false,
              );
              document.getElementById('flowid').addEventListener(
                'scroll',
                AnimEvent.add(function() {
                  linearray[i].position();
                }),
                false,
              );
            }
          }
        },
      },
      sep1: '---------',
      quit: {
        name: 'キャンセル',
        icon: 'quit',
        callback: function() {
          return;
        },
      },
    },
  });

  $('.context-menu-one').on('click', function(e) {
    console.log('clicked', this);
  });
});

// tooltip
$(function() {
  $('.table').tooltip({
    position: {
      my: 'left center',
      at: 'right center',
    },
  });
});

$(function() {
  $('.toolclass').tooltip({
    position: {
      my: 'left center',
      at: 'right center',
    },
  });
});
