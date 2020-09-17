<template>
  <el-form ref="form" :model="animeform" label-width="80px" style="width: 80%">
    <el-form-item label="名称">
      <el-input v-model="animeform.name"></el-input>
      <el-button @click="resetValue(animeform,'name')">重置</el-button>
    </el-form-item>

    <el-form-item label="封面">
      <el-input v-model="animeform.cover"></el-input>
      <el-button @click="resetValue(animeform,'cover')">重置</el-button>
    </el-form-item>

    <el-form-item label="介绍">
      <el-input
        type="textarea"
        :rows="4"
        autosize
        placeholder="请输入内容"
        v-model="animeform.introduction"
      ></el-input>
      <el-button @click="resetValue(animeform,'introduction')">重置</el-button>
    </el-form-item>

    <el-form-item label="标签">
      <el-select
        v-model="animeform.tags"
        multiple
        filterable
        allow-create
        default-first-option
        placeholder="请选择标签"
      >
        <el-option
          v-for="item in tags_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button @click="resetValue(animeform,'tags')">重置</el-button>
    </el-form-item>

    <el-form-item label="声优">
      <el-select filterable allow-create v-model="animeform.actor" multiple placeholder="请选择">
        <el-option
          v-for="item in actor_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button @click="resetValue(animeform,'actor')">重置</el-button>
    </el-form-item>

    <el-form-item label="STAFF">
      <el-select
        filterable
        allow-create
        default-first-option
        v-model="animeform.staff"
        multiple
        placeholder="请选择"
      >
        <el-option
          v-for="item in staff_options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-button @click="resetValue(animeform,'staff')">重置</el-button>
    </el-form-item>

    <el-form-item label="地区">
      <el-select v-model="animeform.region" placeholder="请选择">
        <el-option label="日本" value="日本"></el-option>
        <el-option label="中国" value="中国"></el-option>
        <el-option label="其他" value="其他"></el-option>
      </el-select>
      <el-button @click="resetValue(animeform,'region')">重置</el-button>
    </el-form-item>

    <el-form-item label="发布时间">
      <el-col :span="11">
        <el-date-picker
          type="month"
          placeholder="选择日期"
          v-model="animeform.publish"
          style="width: 100%;"
        ></el-date-picker>
      </el-col>
      <el-button @click="resetValue(animeform,'publish')">重置</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit(animeform)">提交</el-button>
      <el-button @click="onClose()">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import animeApi from "@/services/Anime";
export default {
  data() {
    return {
      old_anime_form: {},
      animeform: {},
      actor_options: [],
      staff_options: [],
      tags_options: [],
    };
  },
  mounted() {
    const id = this.$route.params.id;
    animeApi
      .getDetail(id)
      .then((res) => {
        this.old_anime_form = res.data.results;
        this.animeform = Object.assign({}, this.old_anime_form);
      })
      .catch((error) => {
        this.$message.error(error);
      });
  },
  methods: {
    onSubmit(formName) {
      const that = this;
      let changes = [];
      // 判断修改项
      const old_anime_form = this.old_anime_form;
      for (let i in old_anime_form) {
        // 注意引用类型 object !
        if (typeof formName[i] === "object") {
          if (formName[i].toString() !== old_anime_form[i].toString()) {
            changes.push(i);
          }
        } else {
          if (formName[i] !== old_anime_form[i]) {
            changes.push(i);
          }
        }
      }
      //console.log(this.old_anime_form)
      if (changes.length > 0) {
        const anime = formName;
        //console.log("changes:", changes);
        animeApi
          .edit(anime, changes)
          .then((res) => {
            if (res.data.status == "1") {
              that.$message("修改成功!");
              changes = [];
              setTimeout(() => {
                window.location.replace(
                  "../" + that.old_anime_form._id
                );
              }, 1000);
            } else {
              that.$message("错误: " + res.data.error);
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      } else {
        that.$message("未修改内容!");
      }
    },
    onClose() {
      console.log("close");
    },
    resetValue(formName, name) {
      formName[name] = this.old_anime_form[name];
    },
  },
};
</script>
