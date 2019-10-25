<template>
    <section>
        <div style="width: 80%; margin: 0 auto; padding-top: 5%; position: relative;">
            <div style = "display:inline-block; margin-right: 18%;">
                <img src = "../../assets/serverError.png" style="margin-top: 60px;"/>
            </div>
            <div style = "position: absolute; top: 10px; right: 80px;">
                <h1 style = "font-size:72px;">500</h1>
                <p style="margin-top: -50px;">抱歉，服务器出错了</p>
                <el-button type="primary" style = "padding: 10px 15px; margin-top: 5px;"
                           @click="$router.push({ path: '/dashboard'})">返回首页</el-button>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: 'ServerError',
}
</script>
