<!DOCTYPE html>
<meta http-equiv="content-type" charset="utf-8" />
<style>
  * {
    margin: 0px;
  }
</style>
<html lang="“ja”">
  <head>
    <link rel="stylesheet" href="CSS/header.css" type="text/css" />
    <link rel="stylesheet" href="CSS/mypage.css" type="text/css" />
    <title>mypage</title>
    <script src="JS/jquery-3.4.1.min.js"></script>
    <script src="JS/mypage.js"></script>
  </head>
  <body>
    <div class="background">
    <div id="header"></div>

    <div class="profile-card">
      <div class="profile-card__inner">
        <div class="profile-thumb">
          <img src="man.png" alt="アイコン" />
        </div>
        <div class="profile-content">
          <span class="profile-name" id="name"></span>
          <span class="profile-job"><font size="5"><?php
            session_start();
            if(isset($_SESSION['NAME'])){
              echo $_SESSION['NAME'];
            }    
            else{
              echo "ゲスト";
            }
          ?>
          </font></span>
          <span align="center" class="profile-intro"
            ><font size="5">よろしくお願いします。</font></span
          >
          <form action="logout.php">
            <div style="text-align: center;">
              <input
                type="submit"
                name="name"
                value="ログアウト"
                class="btn-push"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
    <div align="center" style="font-size: 30px;">
      <p>
        <br/><br />
            Coming Soon...
      </p>
    </div>
  </div>
  </body>
</html>
