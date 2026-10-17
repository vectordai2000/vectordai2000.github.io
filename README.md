# Zifeng Dai — personal site

一个纯静态的个人主页 + 博客，基于 GitHub Pages，无需构建、无需数据库。

- 页面：首页 / Research / Writing / Projects / About / 404
- 文章：4 篇（2 篇研究笔记 + 2 篇旧博客整理）
- 设计：暖纸色 + 衬线标题 + 等宽标签，支持深色模式、响应式、减少动态效果
- 依赖：0。没有框架，没有 npm，没有 analytics

## 本地预览

直接双击 `index.html` 也能看，但推荐起一个本地服务器（Projects 页的 GitHub 实时数据需要 HTTP）：

```powershell
# 在项目根目录
python -m http.server 8000
```

然后打开 <http://localhost:8000/>。

## 部署到 GitHub Pages（网页上传，不用装 Git）

仓库已经建好：<https://github.com/vectordai2000/vectordai2000.github.io>

### 上传文件

1. 打开上面的仓库地址。
2. 点页面里的 **uploading an existing file**，或者 **Add file → Upload files**。
3. 打开本地文件夹：

   ```text
   C:\Users\代子风\Desktop\研究生学习\个人博客
   ```

4. 按 `Ctrl+A` 选中**文件夹里面的所有内容**（`assets`、`posts`、所有 `.html`、`README.md` 等），拖进网页的上传区域。
   - 不要拖整个“个人博客”文件夹，否则网站会变成 `/个人博客/` 子目录；要拖它里面的文件。
   - `.github` 和 `.nojekyll` 是隐藏文件，默认不会被选中，也不需要上传。
5. 页面下方填提交信息 `Initial personal site`，点 **Commit changes**。

### 打开 Pages

1. 进入仓库 **Settings → Pages**。
2. **Build and deployment → Source** 选 **Deploy from a branch**。
3. **Branch** 选 `main`，文件夹选 `/ (root)`，点 **Save**。
4. 等 1–3 分钟，访问 <https://vectordai2000.github.io/>。

### 以后更新

网页上传方式：重复上面的上传步骤，覆盖同名文件即可。  
如果以后装了 Git，也可以在本地改完后：

```powershell
git add .
git commit -m "Update site"
git push
```

Pages 会自动重新发布。

> 如果你更想用 `blog` 仓库（网址会变成 `https://vectordai2000.github.io/blog/`），所有相对链接仍然可用，但需要改两处：
> - `404.html` 里的 `/` 改成 `/blog/`
> - 所有页面里的 `https://vectordai2000.github.io/assets/og.png` 改成 `https://vectordai2000.github.io/blog/assets/og.png`
>
> 更推荐现在这种用户主页，网址更短。

## 想改内容，从哪里下手

| 想改什么 | 位置 |
| --- | --- |
| 显示名、页脚署名 | 所有 `.html` 里搜索 `Zifeng Dai` |
| 新 GitHub 账号 | 搜索 `vectordai2000` |
| 旧账号 / 论文代码 | 搜索 `hkhldzf` |
| 头像 | 目前用的是 `ZD` 字母组合（`about.html` 里是内联 SVG，其他页面是 `.avatar--mono`）。想换成真人照片：把 `<span class="avatar avatar--mono">ZD</span>` 换成 `<img class="avatar" src="assets/img/portrait.jpg" alt="...">`，并把 About 页的 SVG 换成 `<img>` |
| 邮箱 / 其他联系方式 | 目前**没有公开邮箱**，只在 GitHub 联系。要加的话，在 `about.html` 的 Elsewhere 和页脚 CTA 里加 `mailto:` |
| 论文信息 | `research.html`、`index.html` 的 paper 区块、`posts/*.html` 的文末注释 |
| 文章列表 | `blog.html` 和 `index.html` 的 Writing 区块（两边都要改） |
| 导航 / 页脚 | 每个 HTML 文件顶部和底部（这是无构建站点的代价） |
| 颜色 / 字体 | `assets/css/style.css` 顶部的 `:root` 变量 |

### 新增一篇文章

1. 复制 `posts/first-mile-of-machine-learning.html`，重命名。
2. 改 `<title>`、`<h1>`、日期、正文；文章正文放在 `.article-body` 里。
3. 在 `blog.html` 里复制一条 `.post-row`，改链接、日期、标题、摘要、`data-tags`。
4. 在 `index.html` 的 Writing 区块复制一条（只放最新 3 篇）。
5. 如果用了新标签，在 `blog.html` 的筛选按钮里加一个 `data-filter="..."`。

### 关于文章的真实性

这 4 篇文章是基于公开信息整理的**初稿**，不是从你旧博客逐字搬运的：

- `why-small-targets-are-hard.html`：根据论文摘要和代码结构写的科普/研究笔记，数字来自论文。
- `building-targ-yolo.html`：工程反思，涉及 `train.py`、`train_dual.py`、`train_triple.py`、`RepMS.py`、`DDetHead.py` 和 103 MB checkpoint，均来自仓库实际结构。
- `privacy-on-a-public-ledger.html`：根据旧博客 2024 年文章改写。
- `first-mile-of-machine-learning.html`：根据旧博客 2023 年文章改写。

发布前建议你通读一遍，尤其是个人经历、时间线和“我们”做了什么的表述，按你的真实情况删改。**论文里的结果和作者信息是准确的，但文章中的心路历程是我替你写的草稿。**

## GitHub 实时数据

`projects.html` 会用 GitHub API 读取旧账号 `hkhldzf` 的仓库，更新 star 数和更新时间。API 失败时保留 HTML 里的静态快照，不影响阅读。

GitHub 匿名 API 每小时限额 60 次/IP。如果访问量大，可以去掉这段 JS，或者改为构建时抓取。

## 目录

```text
.
├─ index.html                  首页
├─ research.html               论文详情、贡献、BibTeX
├─ blog.html                   文章列表 + 标签筛选
├─ projects.html               项目 + GitHub 快照
├─ about.html                  个人介绍、时间线、Colophon
├─ 404.html                    自定义 404（内联样式，不依赖外部文件）
├─ preview.png                 首页截图（仅用于预览，可删）
├─ posts/
│  ├─ why-small-targets-are-hard.html
│  ├─ building-targ-yolo.html
│  ├─ privacy-on-a-public-ledger.html
│  └─ first-mile-of-machine-learning.html
├─ assets/
│  ├─ css/style.css
│  ├─ js/main.js
│  ├─ og.png                    1200×630 社交分享图
│  └─ favicon.svg
├─ .nojekyll                   隐藏文件；网页上传会跳过，当前站点不需要
└─ robots.txt
```

## 说明

- 站点没有 cookie、没有统计脚本。唯一的外部请求是 Projects 页的 GitHub API；头像用的是本地字母组合，不依赖 GitHub 图片。
- 内容版权归你；代码部分可以按你喜欢的许可证处理（当前仓库没有放 LICENSE）。
- 深色模式跟随系统，手动切换后会记住选择。
- 打印文章时会自动隐藏导航和页脚。

## 后续可以加

- RSS / sitemap（需要固定域名后生成绝对链接）
- Google Scholar / ORCID / LinkedIn 链接
- 中英双语切换
- 一个真正的静态站点生成器（文章多了以后，手写 HTML 会累）

如果哪天想从“手写 HTML”升级到 Astro 或 Eleventy，现有的 CSS 和内容都可以直接搬过去。
