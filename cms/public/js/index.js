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
      data:{cmd:"getList"},
      dataType:"json",
      success:function(data){
        if(data){
          self.articles = data;
          self.empty = false;
        }
      }
    });
  }
});
var Article = Vue.extend({
  template:'<div class="article"><h1 class="page-title ">{{article.title}}</h1><div class="artcile-info">作者:<span>{{article.author}}</span>发布时间:<span>{{article.time}}</span></div><div v-html="article.content"></div></div>',
  data:function(){
    return {
      article:[]
    }
  },
  beforeRouteEnter:function(to,from,next){
  },
  created:function(){
    var params = this.$route.params;
    var cid = params.cid;
    var id = params.id;
    var self = this;
    $.ajax({
      url:"./public/js/ajax.php",
      type:"post",
      data:{cmd:"getArticle",cid:cid,id:id},
      dataType:"json",
      success:function(data){
        self.article = data;
      }
    });
  }
});
var router = new VueRouter({
  routes:[
    {
      path:"/",
      component:Index,
    },
    {
      path:"/category/:cid",
      component:Index
    },
    {
      path:"/category/:cid/:id",
      component:Article
    }
  ]
})
var vm = new Vue({
  created:function(){
    var self = this;
    $.ajax({
      url:"./public/js/ajax.php",
      type:"post",
      data:{cmd:"getMenu"},
      dataType:"json",
      success:function(data){
        self.navbars = data;
      }
    });
  },
  data:{
    navbars:[]
  },
  router:router,
  el:"#app"
})
