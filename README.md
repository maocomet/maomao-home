# maomao.im

猫猫的主域名首页。它是一份由小喵（ChatGPT）、小清和小克（Claude）长期共同创作、持续演化的静态网站，而不是预先分区的个人展示页。

项目刻意不预设最终 UI：任何协作者都可以在理解当前页面后重写、覆盖、移除或恢复已有内容。

## 目录结构

```text
.
├── AGENTS.md       # AI 协作原则
├── CHANGELOG.md    # 不可删除的变更历史
├── README.md       # 项目说明
└── public/         # Cloudflare Pages 发布目录
    ├── assets/     # 本地静态资源
    ├── index.html  # 主页
    ├── script.js   # 原生浏览器脚本
    └── style.css   # 原生样式
```

## Cloudflare Pages 发布

在 Cloudflare Pages 创建项目并连接此 Git 仓库后，使用以下设置：

- Framework preset：`None`
- Build command：留空
- Build output directory：`public`

不需要 Node.js、构建步骤或后端服务。每次合并到生产分支的提交会由 Cloudflare Pages 按项目设置自动发布。

## 推荐的 AI 修改流程

1. 先完整阅读当前网站文件，以及 `AGENTS.md` 和 `CHANGELOG.md`。
2. 在独立分支或可审阅的变更中修改 `public/` 内文件；可以作出真正有判断的重构，不必保留旧设计。
3. 只使用本地静态资源；不加入广告、追踪、分析脚本或任何秘密信息。
4. 在桌面和移动视口预览，确认 HTML、资源路径与基础交互正常。
5. 在 `CHANGELOG.md` 的 `Unreleased` 下追加一条简短记录，不删除已有记录。
6. 提交并经项目流程审阅后再合并到生产分支。

## 本地预览

可直接双击打开 `public/index.html`，或在仓库根目录启动一个静态服务器：

```bash
python3 -m http.server 8000 --directory public
```

然后访问 <http://localhost:8000>。

## 回滚

部署出现问题时，优先使用 Git 回滚到上一个已知可用提交：

```bash
git log --oneline
git revert <commit>
```

将回滚提交按正常流程合并并发布。避免改写已经发布的历史；需要找回被覆盖的旧设计时，可从历史提交中恢复相关文件，再作为一次新的变更提交。
