# 基于jQuery的全屏滚动的插件
![demo1](https://raw.githubusercontent.com/dengliran/wheel/master/screenshot/wheel_base_500.gif)

## 如何使用
### 1、HTML结构
```
<div class="wheel-container">
    <section class="wheel-section">
        <!-- 自定义的内容 -->
    </section>
    <section class="wheel-section">
        <!-- 自定义的内容 -->
    </section>    
</div>
```
### 2、初始化
引入 `jquery.js` 库和 `jquery-wheel.js`，`wheel.css` 样式表可根据设计需求更改动画，嵌入项目样式表或直接引入。
```
$('.wheel-container').wheel();
```
## 配置
```
$('.wheel-container').wheel({
    pagination: true,
    sectionClass: '.wheel-section',
    rootSectionClass: '.wheel-rootSection',
    paginationClass: '.wheel-pagination'
})
```
`pagination` : 是否使用分页器，默认值：true 。  
`sectionClass` : 重命名.wheel-section节点，默认值：'.wheel-section'。  
`rootSectionClass` : 重命名.wheel-rootSection节点，默认值：'.wheel-rootSection'。  
`paginationClass` : 重命名.wheel-pagination节点，默认值：'.wheel-pagination'。  
## 切换效果
切换效果通过添加类名和绑定animationend事件动画结束时移除类名，可自定义keyframe动画，实现不同的切换效果。  
![demo2](https://raw.githubusercontent.com/dengliran/wheel/master/screenshot/wheel_horizontal_500.gif)  
只需稍作更改就实现横向切换。

## 横跨页面的元素
在 .wheel-container 里插入一个或多个 `.wheel-rootSection`元素，并添加自定义属性`data-index` ,赋值数组代表出现的页码。
```
<div class="wheel-container">
    <div class="wheel-rootSection" data-index="[1,2]">
        <p>横跨1,2页的文字</p>
    </div>
    <section class="wheel-section">
        <!-- 自定义的内容 -->
    </section>
    <section class="wheel-section">
        <!-- 自定义的内容 -->
    </section>    
</div>
```
rootSection元素出现在页面时会添加`active-s + (页码)`类名，利用该类名的页码切换可自定义transition过渡动画，或keyframes帧动画。  
![shot](https://raw.githubusercontent.com/dengliran/wheel/master/screenshot/active-s.jpg)

## 禁止滑动状态
在 .wheel-container 上添加类名 `noSlideUp` `noSlideDown` 分别禁止上下滑动。