<template>
  <el-table :data="tableData" width="100%" border>
    <el-table-column label="封面" width="120">
      <template slot-scope="scope1">
        <el-image :src="scope1.row.cover" alt style="width: 100px;height: 130px;" fit="fit"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称" width="120" sortable></el-table-column>
    <el-table-column
      prop="tags"
      label="标签"
      width="90"
      :filters="tags_options"
      :filter-method="filterHandler"
    ></el-table-column>
    <el-table-column prop="region" label="地区" width="90" sortable></el-table-column>
    <el-table-column prop="publish" label="时间" sortable width="90"></el-table-column>

    <el-table-column label="操作" width="270">
      <template slot-scope="scope">
        <el-button size="mini" @click="handleClick(scope.row)">查看</el-button>
        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import animeApi from "@/services/Anime";
export default {
  data() {
    return {
      tableData: [],
      tags_options: [],
    };
  },
  mounted() {
    animeApi
      .getList()
      .then((res) => {
        this.tableData = res.data.results;
      })
      .catch((error) => {
        this.$message.error(error);
      });
  },
  methods: {
    handleEdit(index, row) {
      window.location = `./edit/${row._id}`;
    },
    handleDelete(index, row) {
      const that = this;
      const id = row._id;
      animeApi
        .delete(id)
        .then((res) => {
          if (res && res.data.status == "1") {
            that.$message({
              type: "success",
              message: "删除成功!",
            });
          } else {
            that.$message.error("错误: " + res.data.error);
          }
        })
        .catch((error) => {
          that.$message.error(error);
        });
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      if (row[property]) {
        console.log(row[property]);
        return row[property].indexOf(value) > -1;
      } else {
        return false;
      }
    },
    handleClick(val) {
      window.location = `./${val._id}`;
    },
  },
};
</script>
