# Dashboard 布局系统

## 概览

本项目使用了经典的 Dashboard 布局,包含左侧导航栏、顶部导航栏和主内容区域。

## 文件结构

```
src/app/
├── components/
│   └── layout/
│       ├── DashboardLayout.tsx  # 主布局组件
│       ├── Sidebar.tsx          # 左侧导航栏
│       ├── Topbar.tsx           # 顶部导航栏
│       └── index.ts             # 导出文件
├── (pages)/
│   ├── layout.tsx               # Pages 布局配置
│   └── nutrition/               # 营养分析页面
└── page.tsx                     # 首页(重定向到 /nutrition)
```

## 组件说明

### DashboardLayout

主布局组件,包含:

- 240px 宽度的固定左侧导航栏
- 顶部导航栏
- 主内容区域(带 padding)

### Sidebar

左侧导航栏,包含:

- Logo 和标题
- 导航菜单项
- 底部设置菜单
- 活跃状态高亮显示

### Topbar

顶部导航栏,包含:

- 搜索框
- 消息通知图标(带徽章)
- 铃铛通知图标(带徽章)
- 用户头像和下拉菜单

## 添加新页面

1. 在 `src/app/(pages)/` 目录下创建新页面:

```tsx
// src/app/(pages)/dashboard/page.tsx
export default function DashboardPage() {
	return (
		<div>
			<h1>Dashboard</h1>
			{/* 你的内容 */}
		</div>
	);
}
```

2. 在 `Sidebar.tsx` 中添加菜单项:

```tsx
const menuItems: MenuItem[] = [
	// ... 现有菜单项
	{
		text: 'Dashboard',
		icon: <DashboardIcon />,
		path: '/dashboard',
	},
];
```

## 定制化

### 修改侧边栏宽度

在 `DashboardLayout.tsx` 和 `Topbar.tsx` 中修改 `drawerWidth` 常量。

### 修改颜色主题

所有组件都使用 MUI 的主题系统,可以在 `theme` 配置中统一修改。

### 修改 Logo

在 `Sidebar.tsx` 的 `Toolbar` 部分修改 Logo 显示。

## 技术栈

- **Next.js 16** - React 框架
- **Material-UI (MUI)** - UI 组件库
- **TypeScript** - 类型安全

## 布局特性

- ✅ 响应式设计
- ✅ 固定侧边栏
- ✅ 固定顶部导航
- ✅ 路由导航
- ✅ 活跃状态显示
- ✅ 通知徽章
- ✅ 用户菜单
- ✅ 搜索功能位置

## 启动项目

```bash
npm run dev
```

访问 http://localhost:3000 将自动重定向到 `/nutrition` 页面。
