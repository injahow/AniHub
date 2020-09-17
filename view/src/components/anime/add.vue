<template>
  <el-form ref="form" :model="animeform" label-width="80px" style="width: 50%">
    <el-form-item label="名称">
      <el-input v-model="animeform.name"></el-input>
    </el-form-item>

    <el-form-item label="封面">
      <el-input v-model="animeform.cover"></el-input>
    </el-form-item>

    <el-form-item label="介绍">
      <el-input
        type="textarea"
        :rows="8"
        autosize
        placeholder="请输入介绍"
        v-model="animeform.introduction"
      ></el-input>
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
    </el-form-item>

    <el-form-item label="地区">
      <el-select v-model="animeform.region" placeholder="请选择">
        <el-option label="日本" value="日本"></el-option>
        <el-option label="中国" value="中国"></el-option>
        <el-option label="其他" value="其他"></el-option>
      </el-select>
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
      animeform: [],
      actor_options: [],
      staff_options: [],
      tags_options: [],
    };
  },
  mounted() {

    console.log('xxxxxxxxxxxxxxxxx');
  },
  methods: {
    onSubmit(anime) {
      animeApi
        .add(anime)
        .then((res) => {
          if (res.data.status == "1") {
            this.$message("提交成功!");
          } else {
            this.$message("错误: " + res.data.error);
          }
        })
        .catch((error) => {
          this.$message.error(error);
        });
    },
    onClose() {
      console.log("close");
    },
  },
};
</script>
