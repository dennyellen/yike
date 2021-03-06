<template>
  <div class="container">
    <div class="header">
      <span class="title">{{ list.length }} 条评论</span>
      <span class="line"></span>
    </div>
    <div class="editor d-flex align-items-start my-4">
      <template v-if="isLogged">
        <avatar :user="currentUser" size="xxs" class="mx-4"></avatar>
        <div class="editor-input">
          <text-complete
            resize="none"
            autosize
            :strategies="strategies"
            placeholder="请输入内容"
            v-model="form.content"
            @focus="onFocus"></text-complete>
          <div class="buttons text-right mt-3" v-if="showButton">
            <button class="btn btn-link" @click="onCancel">取消</button>
            <button v-if="form.content.trim().length > 0" class="btn-outline-info btn" @click="handleSubmit">评论</button>
            <button v-else class="btn-outline-info btn" disabled>评论</button>
          </div>
        </div>
      </template>
      <template v-else>
        请先登录后再评论
      </template>
    </div>
    <div class="comment-list">
      <div class="item mt-4 d-flex align-items-start" v-for="comment in list">
        <avatar :user="comment.user.data" size="xxs" class="mx-4"></avatar>
        <div :id="'comment-' + comment.id" class="comment-main w-100">
          <div class="heading clearfix">
            <router-link class="float-left mr-2" :to="{ name:'user.show', params: { username: comment.user.data.username }}">
              {{ comment.user.data.username }}
            </router-link>
            <small> ⋅ <a :href="'#comment-' + comment.id"><relative-time :datetime="comment.created_at" v-text="comment.created_at"></relative-time></a></small>
          </div>
          <section class="comment-body" v-html="comment.content"></section>
          <div class="comment-footer">
            <vote-button :item="comment" api="comment"></vote-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Avatar from "home/Avatar"
import VoteButton from "home/VoteButton"
import RelativeTime from "home/RelativeTime"
import Emojione from 'emojione'
import TextComplete from 'v-textcomplete'
import { default as githubEmoji } from 'vendor/github_emoji'

export default {
  components: { Avatar, VoteButton, RelativeTime, TextComplete },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      showButton: false,
      form: {
        content: ''
      },
      strategies: [{
        match: /(^|\s):([a-z0-9+\-\_]*)$/,
        search(term, callback) {
          callback(Object.keys(githubEmoji).filter(function (name) {
            return name.startsWith(term);
          }).slice(0, 10))
        },
        template(name) {
          return '<img width="17" src="' + githubEmoji[name] + '"></img> ' + name;
        },
        replace(value) {
          return '$1:' + value + ': '
        },
      }]
    }
  },
  computed: {
    ...mapGetters(['isLogged', 'currentUser']),
  },
  watch: {
    list(items) {
      items.forEach((item) => {
        item.content = Emojione.shortnameToUnicode(item.content)
      })

      return items
    }
  },
  methods: {
    onFocus() {
      this.showButton = true
    },
    onCancel() {
      this.showButton = false
    },
    handleSubmit() {
      if (this.form.content.trim().length <= 0) {
        return
      }

      this.form.type = 'markdown'

      this.$http.post(this.$endpoints.posts + this.$route.params.slug + '/comments', this.form)
          .then((response) => {
            this.form.content = ''
            this.showButton = false

            let comment = response.data.data
            comment.content = Emojione.shortnameToUnicode(comment.content)

            this.list.push(comment)
          })
    },
  }
}
</script>

<style lang="scss" scoped>
.header {
  position: relative;
  display: block;
  margin-top: 16px;
  margin-bottom: 16px;
  line-height: 22px;

  .title {
    position: relative;
    display: inline;
    padding-right: 16px;
    font-weight: 700;
    background-color: #fff;
    z-index: 1;
  }
  .line {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
}
.editor-input {
  width: 85%;
  margin: .2em 0;
}
.btn-link:hover {
  text-decoration: none;
  cursor: pointer;
}
.comment-list .item:last-child, .comment-list .item:first-child {
  margin-bottom: 1.5rem;
}
</style>
