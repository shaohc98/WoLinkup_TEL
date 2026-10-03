# 部署

首期部署目标是一台云主机加托管 PostgreSQL。Caddy 负责 TLS 与反向代理，应用以容器运行，数据库备份、日志、指标和追踪独立保留。

`compose/dev.compose.yaml` 只提供本地 PostgreSQL，不代表生产拓扑。生产密钥不得进入 Compose 文件或仓库。
