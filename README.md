# test-st

＜用途＞

kaleido及びAWSを用いて、コンソーシアム型Ethereum環境を構築し、アセット発行・移転・アトミックスワップ等の基本機能を実装。 簡易デモ用（構築中）

＜構成＞

backend/ nodejs/expressベースで構築。frontendから呼び出され、kaleido、DynamoDBへ処理を渡し、結果をfrontendに返す

frontend/ vuejsベースで構築。UIを担うところで、インプットとアウトプットを提供する画面インターフェース。backendへ処理を渡し、結果を受け取る。
