var Index = Vue.extend({
  template:`<div class="main">
    <div class="article-list">
      <div class="article-item clearfix" v-for="article of articles">
        <div class="article-title"><router-link :to="article.link">{{article.title}}</router-link></div>
        <div class="article-info">
          作者:<span>{{article.author}}</span>日期:<span>{{article.time}}</span>
        </div>
        <div class="article-desc">{{article.desc}}...</div>
        <router-link :to="article.link" class="link">阅读全文</router-link>
      </div>
      <div class="empty-tips" v-if="empty">很抱歉没有发布文章</div>
    </div>
  </div>`,
  data:function(){
    return {
      empty:true,
      articles:[]
    }
  },

  beforeRouteEnter:function(to,from,next){
    var cid = this.$route.params.cid;

  },
  created:function(){
    var self = this;
    $.ajax({
      url:"./public/js/ajax.php",
      type:"post",
      data:{cmd:"getArticle"},
      dataType:"json",
      success:function(data){
        self.articles = data;
        console.log(self.articles);
      }
    });
  }
});
var Article = Vue.extend({
  template:"<div></div>"
});
var router = new VueRouter({
  routes:[
    {
      path:"/",
      component:Index,
    },
    {
      path:"/category/:cid",
      component:Index,
      children:[
        {
          path:":id",
          componetn:Article
        }
      ]
    }
  ]
})
var vm = new Vue({
  created:function(){
    //
  },
  data:{
    navbars:[{link:'/category/1',name:"js"}]
  },
  router:router,
  el:"#app"
})
