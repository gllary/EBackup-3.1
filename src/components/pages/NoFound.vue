<template>
    <section>
        <div style="width: 80%; margin: 0 auto; padding-top: -5%; position: relative;">
            <div style = "display:inline-block; margin-right: 18%;">
                <img src = "../../assets/notFound.png" style="margin-top: 60px;"/>
            </div>
            <div style = "position: absolute; top: 20px; right: 10%;">
                <h1 style = "font-size:72px; margin-top: 80px; padding-top: -20px;">404</h1>
                <p style="margin-top: -30px;">抱歉，你访问的页面不存在</p>
                <el-button type="primary" style = "padding: 10px 15px; margin-top: 5px;"
                           @click="$router.push({ path: '/dashboard'})">返回首页</el-button>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'NoFound',
}
</script>
