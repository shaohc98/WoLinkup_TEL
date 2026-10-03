# 基础设施

```text
infra/
├── compose.yaml             本地依赖
├── database/migrations/     仅追加的数据库迁移
├── docker/                  服务镜像定义（实现阶段加入）
├── kubernetes/              部署清单或 Helm chart（规模化阶段加入）
└── observability/           采集器、仪表盘和告警（实现阶段加入）
```

本地环境只用于开发，不包含生产级高可用、备份、密钥管理或网络隔离配置。生产基础设施必须通过单独的 IaC 仓库或受保护目录管理，并经安全与运维评审。
