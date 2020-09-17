<template>
  <el-table :data="tableData" border style="width: 70%">

    <el-table-column prop="cover" label="封面">
      <template slot-scope="scope">
        <el-image style="width: 100px;" :src="scope.row.cover" fit="fit"></el-image>
      </template>
    </el-table-column>

    <el-table-column prop="name" label="名称" width="180"></el-table-column>

    <el-table-column prop="pinyin" label="拼音"></el-table-column>

    <el-table-column prop="introduction" label="介绍"></el-table-column>

    <el-table-column prop="region" label="地区"></el-table-column>

    <el-table-column prop="staff" label="STAFF"></el-table-column>

    <el-table-column prop="actor" label="声优"></el-table-column>

    <el-table-column prop="publish" label="发布日期"></el-table-column>

  </el-table>
</template>

<script>
import animeApi from "@/services/Anime";
export default {
  data() {
    return {
      tableData: [],
    };
  },
  mounted() {
    const id = this.$route.params.id;
    animeApi
      .getDetail(id)
      .then((res) => {
        this.tableData =[res.data.results];
      })
      .catch((error) => {
        this.$message.error(error);
      });
  },
};
</script>

