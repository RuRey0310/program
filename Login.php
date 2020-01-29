<?php
require 'lib/password.php';   // password_verfy()はphp 5.5.0以降の関数のため、バ
// セッション開始
session_start();

$db['host'] = "localhost";  // DBサーバのURL
$db['user'] = "user-manager";  // ユーザー名
$db['pass'] = "brute-force16";  // ユーザー名のパスワード
$db['dbname'] = "user_management";  // データベース名

// エラーメッセージの初期化
$errorMessage = "";

// ログインボタンが押された場合
if (isset($_POST["login"])) {
    // 1. ユーザIDの入力チェック
    if (empty($_POST["userid"])) {  // emptyは値が空のとき
        $errorMessage = 'ユーザーIDが未入力です。';
    } else if (empty($_POST["password"])) {
        $errorMessage = 'パスワードが未入力です。';
    }

    if (!empty($_POST["userid"]) && !empty($_POST["password"])) {
        // 入力したユーザIDを格納
        $userid = $_POST["userid"];

        // 2. ユーザIDとパスワードが入力されていたら認証する
        $dsn = 'mysql:dbname=user_management;host=localhost';

        // 3. エラー処理
        try {
            $pdo = new PDO($dsn,$db['user'],$db['pass']);

            $stmt = $pdo->prepare('SELECT * FROM user WHERE name = ?');
            $stmt->execute(array($userid));

            $password = $_POST["password"];

            if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                if (password_verify($password, $row['password'])) {
                    session_regenerate_id(true);

                    // 入力したIDのユーザー名を取得
                    $id = $row['id'];
                    $sql = "SELECT * FROM user WHERE id = $id";  //入力したIDからユーザー名を取得
                    $stmt = $pdo->query($sql);
                    foreach ($stmt as $row) {
                        $row['name'];  // ユーザー名
                    }
                    $_SESSION["NAME"] = $row['name'];
                    $sendname = $row['name'];
                    header("Location: index.html");  // メイン画面へ遷移

                    exit();  // 処理終了
                } else {
                    // 認証失敗
                    $errorMessage = 'ユーザーIDあるいはパスワードに誤りがあります。';
                }
            } else {
                // 4. 認証成功なら、セッションIDを新規に発行する
                // 該当データなし
                $errorMessage = 'ユーザーIDあるいはパスワードに誤りがあります。';
            }
        } catch (PDOException $e) {
            $errorMessage = 'データベースエラー';
            //$errorMessage = $sql;
            // $e->getMessage() でエラー内容を参照可能（デバッグ時のみ表示）
            // echo $e->getMessage();
        }
    }
}
?>

<link rel="stylesheet" href="Login.css"  />
<script src="JS/jquery-3.4.1.min.js"></script>
<title>サインイン</title>
<div class="login">
    <h1>サインイン</h1>
    <form method="post">
        <div><font color="#ff0000"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES); ?></font></div>
    	<input type="text" id="userid" name="userid" placeholder="ユーザー名を入力" />
        <input type="password" id="password " name="password" placeholder="パスワードを入力" />
        <button type="submit" id="login" name="login" class="btn btn-primary btn-block btn-large">サインイン</button>
    </form>
    <form action="SignUp.php" >
                
        
        <input type="submit" value="新規登録" class="btn btn-primary btn-block btn-large"></>
            
    </form>
        <form action="index.html">
        <!-- ここは適当に作ってます>
            actionには登録しない場合のページを入れる
        <!-->
                     
                
                <input type="submit" value="rakurakupgへ" class="btn btn-primary btn-block btn-large">
            
        </form>
</div>
