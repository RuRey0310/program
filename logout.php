<?php 
    session_start();
    unset($_SESSION['NAME']); 
    header("Location: index.html");  // メイン画面へ遷移

    exit();  // 処理終了
?>