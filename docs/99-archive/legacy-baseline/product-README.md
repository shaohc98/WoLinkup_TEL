# 产品空间

`product/` 保存产品事实、需求和设计依据，不保存运行时配置。

```text
product/
├── requirements/             产品范围、能力地图和业务规则
└── prototypes/
    ├── README.md             原型使用与版本规则
    ├── analysis.md           对现有原型的审计结论
    └── legacy/               用户提供的原始文件，只读保留
```

新的交互设计应在需求编号下形成版本，不直接改写 `legacy/`。确认后的字段、状态和接口必须同步到 `packages/contracts` 与 `docs/`。
