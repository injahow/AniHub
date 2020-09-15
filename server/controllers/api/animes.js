const pinyin = require('pinyin');
const moment = require('moment');

const Anime = require('../../model/Anime');

module.exports = {

  /**
   * 获取列表部分数据
   * @param  {obejct} ctx
   */
  async getList(ctx) {
    let data = await Anime.find({}, '-_id name cover tags staff');
    ctx.status = 200;
    ctx.body = {
      data,
      status: '1'
    };
  },

  /**
   * 增加数据操作
   * @param   {obejct} ctx
   */
  async add(ctx) {
    const findname = await Anime.find({
      name: ctx.request.body.name
    });
    if (findname.length > 0) {
      ctx.status = 202;
      ctx.body = {
        status: '-1',
        err: '名称重复!'
      };
    } else {
      const anime = ctx.request.body;
      const newAnime = new Anime({
        name: anime.name,
        cover: anime.cover,
        othername: pinyin(anime.name, {
          style: pinyin.STYLE_INITIALS
        }),
        tags: anime.tags,
        staff: anime.staff,
        actor: anime.actor,
        introduction: anime.introduction,
        publish: anime.publish,
        region: anime.region,
      });
      await newAnime.save()
        .then(() => {
          ctx.status = 200
          ctx.body = {
            status: '1'
          }
        })
        .catch((err) => {
          ctx.status = 400
          ctx.body = {
            status: '-1',
            err
          }
        });
    }
  },

  /**
   * 删除信息
   * @param    {obejct} ctx
   */
  async delete(ctx) {
    await Anime.deleteOne({
      _id: ctx.params.id
    }, err => {
      if (err) {
        ctx.status = 400
        ctx.body = {
          status: '-1',
          err
        }
      } else {
        ctx.status = 200
        ctx.body = {
          status: '1',
          msg: '删除成功'
        }
      }
    });
  },

  /**
   * 修改信息
   * @param  {obejct} ctx
   */
  async change(ctx) {
    const new_anime = ctx.request.body.anime
    const changes = ctx.request.body.changes
    let updateFields = {}
    changes.forEach((i) => {
      updateFields[i] = new_anime[i];
    })

    await Anime.updateMany({
      _id: ctx.params.id
    }, updateFields, function (err) {
      if (err) {
        ctx.status = 204;
        ctx.body = {
          status: '-1',
          err
        };
      } else {
        ctx.status = 200;
        ctx.body = {
          status: '1',
        };

      }
    });

  },

  /**
   * 查询详细信息
   * @param  {obejct} ctx
   */
  async getDetail(ctx) {
    let data = await Anime.findById(ctx.params.id).lean();
    data.forEach(function (item) {
      if (item.publish) {
        item.publish = moment(item.publish).format('YYYY-MM');
      }
    });
    ctx.body = data;
  }

}
