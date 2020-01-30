<div>
  <a class="menu" href="index.html">ホーム</a>
</div>
<div>
  <a class="menu" href="flowchart.html">フローチャート</a>
</div>
<div>
  <a class="menu" href="<?php
    session_start();
    if(isset($_SESSION['NAME'])){
        if($_SESSION['NAME'] == 'rakurakupgadmin'){
            echo "admin.php";
        }
        else{
            echo "board.php";
        }
    }
    else{
        echo "board.php";
    }
    ?>
  ">掲示板</a>
</div>
<div>
  <a class="menu" id="Sign" href="<?php
        if(isset($_SESSION['NAME'])){
            echo "mypage.php";
        }
        else{
            echo "Login.php";
        }
        ?>
    ">
      <?php
        if(isset($_SESSION['NAME'])){
            print($_SESSION['NAME']);
        }
        else{
            print("サインイン");
        }
      ?>
  </a>
</div>
<script>
  /* 現在開いてるページのヘッダーを赤くする */
  let activePage = location.pathname;
  const headerClass = document.querySelectorAll('.menu');
  activePage = activePage.split('/');
  for (let i = 0; i < activePage.length; i++) {
    for (let j = 0; j < headerClass.length; j++) {
      if (activePage[i] === headerClass[j].getAttribute('href')) {
        headerClass[j].classList.add('active');
        break;
      }
    }
  }
</script>
