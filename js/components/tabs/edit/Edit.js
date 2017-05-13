// @flow
import React from "react";
import {
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  PixelRatio,
  InteractionManager,
  ActivityIndicator,
  Platform
} from "react-native";
import moment from "moment";
moment.locale("zh-cn");
import Icon from "react-native-vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import ImagePicker from "react-native-image-crop-picker";
import AliyunOSS from "react-native-aliyun-oss";
import uuidV4 from "uuid/v4";
import _ from "lodash";
import Immutatble from "immutable";
import DatePicker from "react-native-datepicker";
import { background, navigatorBlue } from "../../H8Colors";
import { normalize } from "../../H8Text";
import {
  caclateMarginHorizontal,
  paddingHorizontal,
  getOssStsFromLocalstorage
} from "../../utils";
import { endPoint, bucketName, OSS_URL } from "./config";
import { commit, submit } from "./ArticleMutation";
import { dic_add_bnt_font_size } from "../../H8Size";
import {
  ERROR_TITLE,
  UPLOAD_ERROR_CONTENT,
  CAMERA_ERROR,
  LOAD_IMAGE_ERROR,
  DELETE_CONFITM_CONTENT,
  DELETE_CONFITM_TITLE,
  ARTICLE_SUBMIT_SUCCESS,
  ARTICLE_SAVE_SUCCESS,
  EDIT_SWIPER_HEIGHT
} from "../../../constants";
import { updateOssSts } from "../mutation/OssUpdateMutation";
import ImageWraper from "../../ImageWraper";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff"
  },
  icon: {
    marginRight: 12
  },
  wrapper: {},
  avatar: {
    width: "100%",
    height: "99%",
    justifyContent: "flex-end",
    alignItems: "flex-end"
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: "white",
    marginRight: 5,
    color: "#999999"
  },
  imageActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal,
    borderBottomWidth: StyleSheet.hairlineWidth / PixelRatio.get(),
    borderBottomColor: "#999999"
  },
  spliter: {
    width: 0,
    borderRightColor: "#999999",
    borderRightWidth: StyleSheet.hairlineWidth / PixelRatio.get(),
    height: "100%"
  },
  imageAction: {
    width: "100%",
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal,
    paddingVertical: 5,
    borderBottomWidth: StyleSheet.hairlineWidth / PixelRatio.get(),
    borderBottomColor: "#999999"
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: navigatorBlue,
    width: "100%",
    paddingVertical: normalize(10),
    flexDirection: "row"
  },
  buttonText: {
    fontSize: dic_add_bnt_font_size,
    lineHeight: normalize(20),
    color: "#ffffff"
  },
  itemTitle: {
    flex: 1,
    fontWeight: "500",
    lineHeight: normalize(25)
  }
});
export default class Add extends React.Component {
  props: {
    article: Object,
    articleId: string
  };
  constructor(props) {
    super(props);
    this.state = {
      images: Immutatble.List([]),
      article: Immutatble.Map({}),
      birthdayDate: "",
      birthdayTime: "",
      alertText: null,
      ossToken: {}
    };
    this.isUnmount = false;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.article && nextProps.article !== this.props.article) {
      this.setState({
        article: Immutatble.Map(nextProps.article)
      });
      // InteractionManager.runAfterInteractions(() => {
      //   console.log("nextProps.article", nextProps.article);
      //   console.log("this.props.article", this.props.article);
      //   console.log(nextProps.article !== this.props.article);
      //   console.log(this.state.article.toObject());
      // });
    }
  }
  initSaveFunc() {
    this.props.navigation.setParams({
      save: this.save
    });
  }
  validate = (): boolean => {
    let artice = this.state.article.toObject();
    let {
      attachments_maxw,
      title,
      categories,
      name,
      education,
      gender,
      birthday,
      homePlace,
      jobs,
      marriage
      // children,
      // knowledge
    } = artice;
    let requiredFilled =
      !_.isEmpty(title) &&
      !_.isEmpty(categories) &&
      !_.isEmpty(name) &&
      !_.isEmpty(education) &&
      !_.isEmpty(gender) &&
      !_.isEmpty(`${birthday ? birthday : ""}`) &&
      !_.isEmpty(homePlace) &&
      !_.isEmpty(jobs) &&
      !_.isEmpty(marriage);
    return requiredFilled;
  };
  showResponseTip = (text: string): void => {
    this.setState({
      alertText: text
    });
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.setParams({ edited: false });
      let timer = setTimeout(() => {
        clearTimeout(timer);
        if (this.isUnmount) {
          return;
        }
        this.setState({
          alertText: null
        });
      }, 2000);
    });
  };
  save = () => {
    // console.log("saved !");
    let _submit = !!this.state.article.get("submit");
    // validate
    let validated = this.validate();
    if (validated && _submit) {
      this.showResponseTip(ARTICLE_SUBMIT_SUCCESS);
      return;
    } else if (validated && !_submit) {
      this.commit(
        {
          submit: true
        },
        null,
        null,
        response => {
          // console.log(
          //   "response.saveArticle.article.submit",
          //   response.saveArticle.article.submit
          //   // response.saveArticle.article.get("submit")
          // );
          if (response.saveArticle) {
            // this.props.navigation.goBack(null);
            this.setState({
              article: this.state.article.set(
                "submit",
                response.saveArticle.article.submit
              )
            });
            this.showResponseTip(ARTICLE_SUBMIT_SUCCESS);
          }
        },
        true
      );
    } else {
      this.showResponseTip(ARTICLE_SAVE_SUCCESS);
    }
  };
  componentDidMount() {
    this.initOssStsQueue();
    let { birthday, attachments_maxw, attachments } = this.props.article || {};
    attachments_maxw = attachments_maxw || [];
    const { filters } = this.props.navigation.state.params || {};
    this.setState({
      article: Immutatble.Map(this.props.article || { events: { edges: [] } }),
      birthdayDate: birthday ? moment(birthday).format("YYYY-MM-DD") : "",
      birthdayTime: birthday ? moment(birthday).format("a hh:mm") : "",
      filters: filters || {},
      images: this.state.images.push(
        ...attachments_maxw.map((a: string, index: number) => {
          return Immutatble.Map({
            key: attachments[index],
            done: true,
            source: {
              uri: a.replace("http", "https")
            }
          });
        })
      )
    });
    InteractionManager.runAfterInteractions(() => {
      this.initSaveFunc();
    });
  }
  // getOssAccessObject = (): Object => {
  //   const {
  //     viewer: {
  //       ossToken: {
  //         Expiration,
  //         AccessKeyId,
  //         SecurityToken,
  //         AccessKeySecret,
  //         dir
  //       } = {}
  //     } = {}
  //   } = this.props;
  //   // console.log("Expiration------Expiration---:", Expiration);
  //   return {
  //     Expiration,
  //     AccessKeyId,
  //     SecurityToken,
  //     AccessKeySecret,
  //     dir
  //   };
  // };
  updateOssStsToken = (callback: (ossToken: Object) => void = () => {}) => {
    updateOssSts(this.props.relay.environment, (ossToken: Object) => {
      if (_.isEmpty(ossToken) || _.isEmpty(ossToken.AccessKeyId)) {
        Alert.alert("提示", "网络异常，无法初始化");
      } else {
        this.initOss(ossToken);
        callback(ossToken);
      }
    });
  };
  initOssStsQueue = () => {
    // 1. localstorage 2. 是否过期 3. ossStstUpdate
    getOssStsFromLocalstorage((ossToken: Object) => {
      if (_.isEmpty(ossToken) || _.isEmpty(ossToken.AccessKeyId)) {
        // ossStstUpdate
        this.updateOssStsToken();
        return;
      }
      let diff = moment(ossToken.Expiration).diff(moment(), "minutes");
      //10分钟内过期，或者已经过期
      if (diff < 10) {
        // ossStstUpdate
        this.updateOssStsToken();
      } else {
        this.initOss(ossToken);
      }
    });
  };
  initOss = (ossToken: Object) => {
    this.setState({ ossToken });
    const {
      Expiration,
      AccessKeyId,
      SecurityToken,
      AccessKeySecret,
      dir
    } = ossToken;
    // } = this.getOssAccessObject();
    AliyunOSS.enableOSSLog();
    const config = {
      AccessKey: AccessKeyId,
      SecretKey: AccessKeySecret,
      SecretToken: SecurityToken
    };
    AliyunOSS.initWithKey(config, endPoint);
  };
  initArticleBeforeUpload = (onComplete: response => void) => {
    let article_id = this.state.article.get("id") || this.props.articleId;
    if (!!article_id) {
      onComplete();
    } else {
      this.commit({ keys: ["init"], values: ["0"] }, "init", "0", onComplete);
    }
  };
  updateOssStstTokenPromise = () => {
    return new Promise((resolve, reject) => {
      this.updateOssStsToken((stsToken: Object) => {
        resolve(stsToken);
      });
    });
  };
  checkOssStsIsvalid = (): Promise<Object> => {
    if (
      _.isEmpty(this.state.ossToken) ||
      _.isEmpty(this.state.ossToken.Expiration)
    ) {
      // ossStstUpdate
      return this.updateOssStstTokenPromise();
    }
    let { Expiration } = this.state.ossToken;
    let diff = moment(Expiration).diff(moment(), "minutes");
    //5分钟内过期，或者已经过期
    if (diff < 5) {
      // ossStstUpdate
      return this.updateOssStstTokenPromise();
    }
    return Promise.resolve(this.state.ossToken);
  };
  upload = (images: Object[], index: number, keys: string[]): void => {
    if (index >= images.length) {
      return;
    }
    let sourceFile = images[index].path;
    let filePathAndName = keys[index];
    // 记录当前上传文件名
    this.sourceFile = sourceFile;
    this.filePathAndName = filePathAndName;
    // 上传配置信息
    const uploadConfig = {
      bucketName,
      sourceFile,
      ossFile: filePathAndName
    };
    // console.log(
    //   "-----------------AliyunOSS.addEventListener-------------------"
    // );
    AliyunOSS.addEventListener("uploadProgress", this.uploadProgress);
    AliyunOSS.uploadObjectAsync(uploadConfig)
      .then(resp => {
        // resp is true
        // console.log(
        //   "=------------resprespresprespresprespresp----------- : ",
        //   resp
        // );
        // console.log(
        //   "-----------------AliyunOSS.removeEventListener-------------------"
        // );
        AliyunOSS.removeEventListener("uploadProgress", this.uploadProgress);
        if (resp) {
          this.upload(images, index + 1, keys);
        }
      })
      .catch(error => {
        console.log("-------------- upload error --------------", error);
        Alert.alert(ERROR_TITLE, UPLOAD_ERROR_CONTENT);
      });
  };
  getImageFilenameMeta = (
    sourceFile: string
  ): { name: string, suffix: string } => {
    let fileName = _.last(_.split(sourceFile, "/"));
    let arr = _.split(fileName, ".");
    // console.log("file name is : " + _.first(arr));
    return {
      name: _.first(arr),
      suffix: _.last(arr)
    };
  };
  uploadProgress = (p: Object): void => {
    // console.log(
    //   "----------------------p------------------------" + this.filePathAndName,
    //   p.currentSize / p.totalSize
    // );
    let percent = p.currentSize / p.totalSize;
    if (percent === 1) {
      // console.log("------------------percent-----------------", percent);
      this.updateImageUploadState(this.filePathAndName);
      InteractionManager.runAfterInteractions(() => {
        this.commit(
          { keys: ["addImage"], values: [this.filePathAndName] },
          null,
          null,
          () => {
            // console.log("attachment url saved to parse server");
          }
        );
      });
    }
  };
  _deleteImage = (key: string): void => {
    return () => {
      this.commit(
        {
          keys: ["deleteImage"],
          values: [key]
        },
        null,
        null,
        (response: Object) => {
          let images = this.state.images;
          images = images.delete(
            images.findIndex(function(item) {
              return item.get("key") === key;
            })
          );
          this.setState({ images });
        }
      );
    };
  };
  updateImageUploadState = (key: string): void => {
    let images = this.state.images;
    let index = images.findIndex(function(item) {
      return item.get("key") === key;
    });
    // console.log(
    //   "-------------------updateImageUploadState21------------------------",
    //   key,
    //   index,
    //   images.size
    // );
    // images.toArray().forEach(item => {
    //   console.log(
    //     `---------------------------${item.get("key")}----------------`
    //   );
    // });
    if (index !== -1) {
      images = images.update(index, function(item) {
        return item.set("done", true);
      });
      this.setState({ images });
    }
  };
  getOssObjectKey = (img: Object): string => {
    let article_id = this.state.article.get("id") || this.props.articleId;
    const { dir } = this.state.ossToken;
    let suffix = this.getImageFilenameMeta(img.path).suffix;
    let filePathAndName = `${dir}/${article_id}/${uuidV4()}.${suffix}`;
    return filePathAndName;
  };
  imageHandler = (images: Object | Object[]) => {
    if (images && !_.isArray(images)) {
      images = [images];
    }
    console.log("images", images);
    let keys = [];
    let arr = images.map(image => {
      let key = this.getOssObjectKey(image);
      keys.push(key);
      return Immutatble.Map({
        key,
        done: false,
        source: { uri: image.path }
      });
    });
    if (arr.length > 0) {
      this.setState({
        images: this.state.images.push(...arr)
      });
    }
    this.upload(images, 0, keys);
  };
  imgErrorHandler = (type: number) => {
    return (error: any): void => {
      if (error) {
        Alert.alert(
          ERROR_TITLE,
          JSON.stringify(error) + (type === 0 ? CAMERA_ERROR : LOAD_IMAGE_ERROR)
        );
      }
    };
  };
  imageLoadSwitch = (type: number) => {
    return () => {
      this.checkOssStsIsvalid()
        .then(ossToken => {
          this.initArticleBeforeUpload(response => {
            if (type === 1) {
              this.loadImg();
            } else {
              this.camera();
            }
          });
        })
        .catch(error => {
          Alert.alert("提示", "图片上传初始化异常");
        });
    };
  };
  loadImg = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo",
      width: 300,
      height: 400
    })
      .then(this.imageHandler)
      .catch(this.imgErrorHandler(1));
  };
  camera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400
    })
      .then(this.imageHandler)
      .catch(this.imgErrorHandler(0));
  };
  setBirthday = (b: boolean) => {
    return date => {
      // console.log("datedatedatedatedate is ", date);
      let birthday;
      if (b) {
        birthday = `${date} ${this.state.birthdayTime ? this.converDatePickerToTimer(this.state.birthdayTime) : ""}`;
        this.setState({
          birthdayDate: date
          // article: this.state.article.set("birthday", birthday)
        });
      } else {
        let obj = { birthdayTime: date };
        if (this.state.birthdayDate) {
          birthday = `${this.state.birthdayDate} ${this.converDatePickerToTimer(date)}`;
          // obj.article = this.state.article.set("birthday", birthday);
        }
        this.setState(obj);
      }
      // console.log("birthdaybirthdaybirthdaybirthday is ", birthday);
      if (birthday) {
        InteractionManager.runAfterInteractions(() => {
          this.commit(
            {
              keys: ["birthday"],
              values: [`Date:${moment(_.trim(birthday)).valueOf()}`]
            },
            "birthday",
            moment(_.trim(birthday)).valueOf()
          );
        });
      }
    };
  };
  converDatePickerToTimer = (time: string) => {
    if (!time) {
      return "";
    }
    let [a, t] = time.split(" ");
    if (a === "下午" || a === "晚上" || a.toLowerCase === "pm") {
      let [h, m] = t.split(":");
      let hh = _.padStart(`${parseInt(h) + 12}`, 2, "0");
      return `${hh}:${m}`;
    }
    return t;
  };
  componentWillUnmount() {
    this.isUnmount = true;
    ImagePicker.clean()
      .then(() => {
        console.log("removed all tmp images from tmp directory");
      })
      .catch(e => {
        console.log("removed all tmp images from tmp directory error : ", e);
      });
  }
  onBack = (args: {
    fieldName: string,
    newValue: string | string[],
    nodeId: string,
    multiple: boolean
  }) => {
    if (this.isUnmount) {
      return;
    }
    let _newValue = args.newValue;
    if (args.fieldName === "events" && _.isEmpty(args.nodeId)) {
      return this.addNewEvent(_newValue);
    } else if (args.fieldName === "events" && !_.isEmpty(args.nodeId)) {
      return this.updateEvennt(args.nodeId, _newValue);
    }
    this.commit(
      {
        keys: [args.fieldName],
        values: [
          _.isString(_newValue)
            ? _newValue
            : this.formatValues(_newValue, args.multiple)
        ]
      },
      args.fieldName,
      _newValue
    );
  };
  updateEvennt = (eventId: string, value: string): void => {
    this.commit(
      {
        eventIds: [eventId],
        eventValues: [value]
      },
      null,
      null,
      response => {
        // console.log(response);
        if (response.saveArticle && !this.props.article) {
          let { updatedEvents, article } = response.saveArticle;
          if (!_.isEmpty(updatedEvents)) {
            let { edges: olderEdges } = this.state.article.get("events");
            // console.log(_.concat(olderEdges.edges, updatedEvents));
            let list = Immutatble.List(olderEdges);
            list = list.update(
              list.findIndex(function(item) {
                return item.node.id === eventId;
              }),
              function(item) {
                return { node: { ...item.node, text: value } };
              }
            );
            if (this.isUnmount) {
              return;
            }
            this.setState({
              article: this.state.article
                .set("events", {
                  edges: list.toArray()
                })
                .set("id", article.id || article.__id)
            });
          }
        }
      }
    );
  };
  addNewEvent = (text: string) => {
    this.commit(
      {
        addEvents: [text]
      },
      null,
      null,
      response => {
        // console.log(response);
        if (response.saveArticle && !this.props.article) {
          let { newEvents, article } = response.saveArticle;
          if (!_.isEmpty(newEvents)) {
            let olderEdges = this.state.article.get("events");
            // console.log(_.concat(olderEdges.edges, newEvents));
            if (this.isUnmount) {
              return;
            }
            this.setState({
              article: this.state.article
                .set("events", {
                  edges: _.concat(olderEdges.edges, newEvents)
                })
                .set("id", article.id || article.__id)
            });
          }
        }
      }
    );
  };
  commit = (
    input: Object,
    fieldName: string,
    newValue: string | Number,
    onComplete: (response: Object) => void,
    isSubmit: boolean = false
  ): void => {
    let _input;
    if (_.isBoolean(input.submit)) {
      _input = input;
    } else {
      _input = { ...input, submit: !!this.state.article.get("submit") };
    }
    _input.id = this.state.article.get("id") || this.props.articleId || "new";
    // console.log("this.props.article", this.props.article);
    var func = isSubmit ? submit : commit;
    func(
      this.props.relay.environment,
      this.props.viewer,
      _input,
      response => {
        // console.log(response);
        if (
          response.saveArticle &&
          !this.props.articleId &&
          fieldName &&
          newValue
        ) {
          if (this.isUnmount) {
            return;
          }
          this.setState({
            article: this.state.article
              .set(fieldName, newValue)
              .set(
                "id",
                response.saveArticle.article.id ||
                  response.saveArticle.article.__id
              )
          });
        }
        if (onComplete) {
          onComplete(response);
        }
        this.props.navigation.setParams({ edited: true });
      },
      isSubmit ? this.state.filters : !this.props.article
    );
  };
  formatValues = (values: string[] | Object, multiple: boolean): string => {
    if (_.isArray(values)) {
      if (multiple) {
        return JSON.stringify(values);
      } else {
        return _.first(values);
      }
    }
    return JSON.stringify(values);
  };
  render() {
    // console.log('this.state.article.get("submit")', this.props);
    // const { viewer: { ossToken = {} } = {} } = this.props;
    const { article, alertText } = this.state;
    const events = article.get("events");
    // console.log("events events events : ", events);
    const { edges = [] } = events || {};
    // console.log("eventseventseventseventsevents : ", JSON.stringify(events));
    let showSwiper = this.state.images.size > 0;
    return (
      <View style={styles.container}>
        {alertText &&
          <View
            style={{
              width: "100%",
              justifyContent: "center",
              backgroundColor: "rgba(0,168,84, 1)",
              alignItems: "center",
              paddingVertical: normalize(5)
            }}
          >
            <Text style={{ color: "#ffffff" }}>{alertText}</Text>
          </View>}
        <ScrollView>
          {showSwiper &&
            <ImageSwiper
              deleteImage={this._deleteImage}
              images={this.state.images}
            />}
          <View style={styles.imageActions}>
            <TouchableOpacity onPressIn={this.imageLoadSwitch(0)}>
              <View style={styles.imageAction}>
                <Icon name="md-camera" style={styles.actionButtonIcon} />
                <Text>命盘拍照</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.spliter} />
            <TouchableOpacity onPress={this.imageLoadSwitch(1)}>
              <View style={styles.imageAction}>
                <Icon name="md-images" style={styles.actionButtonIcon} />
                <Text>从相册选择命盘</Text>
              </View>
            </TouchableOpacity>
          </View>
          <InputItem
            placeholder="请输入标题"
            fieldName="title"
            title="标题"
            value={this.state.article.get("title")}
            onPress={this.editText}
            multiline={true}
            maxLength={50}
            tip="4 - 50个字符，可由中英文、数字组成"
            required={true}
          />
          <InputItem
            fieldName="categories"
            title="类别"
            multiline={true}
            value={this.state.article.get("categories")}
            onPress={this.editSelect("Category", true)}
            required={true}
          />
          <InputItem
            placeholder="姓名/昵称"
            fieldName="name"
            title="姓名/昵称"
            maxLength={50}
            tip="最多输入50字内容"
            value={this.state.article.get("name")}
            onPress={this.editText}
            required={true}
          />
          <InputItem
            fieldName="gender"
            title="性别"
            value={this.state.article.get("gender")}
            onPress={this.editSelect("Gender")}
            required={true}
          />
          <InputItem
            fieldName="birthday"
            title="出生时间"
            value=""
            showArrow={false}
            onPress={() => {}}
            style={{ borderBottomWidth: 0, paddingBottom: 0 }}
            required={true}
          />
          <View style={[styles.item, { paddingVertical: 0 }]}>
            <DatePicker
              style={{ borderWidth: 0 }}
              date={this.state.birthdayDate}
              mode="date"
              showIcon={false}
              placeholder="出生年月日"
              format="YYYY-MM-DD"
              maxDate={moment().format("YYYY-MM-DD")}
              confirmBtnText="确定"
              cancelBtnText="取消"
              customStyles={{
                dateInput: {
                  marginLeft: 36,
                  borderWidth: 0
                },
                dateText: {
                  color: "#666666"
                },
                dateIcon: {
                  width: 0,
                  height: 0
                }
              }}
              onDateChange={this.setBirthday(true)}
            />
            <DatePicker
              style={{ borderWidth: 0 }}
              date={this.state.birthdayTime}
              mode="time"
              is24Hour={true}
              showIcon={false}
              placeholder="出生时间"
              format="a hh:mm"
              confirmBtnText="确定"
              cancelBtnText="取消"
              customStyles={{
                dateInput: {
                  marginLeft: 36,
                  borderWidth: 0
                },
                dateText: {
                  color: "#666666"
                },
                dateIcon: {
                  width: 0,
                  height: 0
                }
              }}
              onDateChange={this.setBirthday(false)}
            />
          </View>
          <InputItem
            fieldName="homePlace"
            title="出生地点"
            value={this.state.article.get("homePlace")}
            onPress={this.quyuSelect}
            multiline={true}
            required={true}
          />
          <InputItem
            fieldName="education"
            title="学历"
            value={this.state.article.get("education")}
            onPress={this.editSelect("Education")}
            required={true}
          />
          <InputItem
            fieldName="jobs"
            title="职业"
            value={this.state.article.get("jobs")}
            onPress={this.editSelect("Job", true)}
            required={true}
          />
          <InputItem
            fieldName="marriage"
            title="婚姻"
            value={this.state.article.get("marriage")}
            onPress={this.editSelect("Marriage")}
            required={true}
          />
          <InputItem
            placeholder="请输入子女情况"
            fieldName="children"
            title="子女"
            multiline={true}
            maxLength={500}
            tip="最多输入500字内容"
            value={this.state.article.get("children")}
            onPress={this.editText}
          />
          {edges.map((edge, index) => (
            <InputItem
              key={edge.node.id}
              deleteEvent={this.deleteEvent(edge.node.id)}
              fieldName="events"
              nodeId={edge.node.id}
              title={`重要事件${index + 1}`}
              maxLength={500}
              tip="最多输入500字内容"
              multiline={true}
              value={edge.node.text}
              onPress={this.editText}
            />
          ))}
          <InputItem
            placeholder="请输入命理知识备注"
            fieldName="knowledge"
            title="命理知识备注"
            maxLength={1000}
            tip="最多输入1000字内容"
            multiline={true}
            value={this.state.article.get("knowledge")}
            onPress={this.editText}
          />
        </ScrollView>
        <TouchableOpacity onPress={this.addEvent}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>添加重要事件</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  addEvent = () => {
    this.props.navigation.navigate("TextEditor", {
      fieldName: "events",
      title: "新增重要事件",
      maxLength: 500,
      tip: "最多输入500字内容",
      onBack: this.onBack,
      multiline: true
    });
  };
  quyuSelect = args => {
    return () => {
      this.props.navigation.navigate("QuyuSelector", {
        ...args,
        onBack: this.onBack
      });
    };
  };
  editSelect = (code: string, multiple: boolean = false) => {
    return args => {
      return () => {
        this.props.navigation.navigate("Selector", {
          ...args,
          onBack: this.onBack,
          code,
          multiple
        });
      };
    };
  };
  editText = args => {
    return () => {
      this.props.navigation.navigate("TextEditor", {
        ...args,
        onBack: this.onBack
      });
    };
  };
  deleteEvent = (eventId: string): (() => {}) => {
    return () => {
      Alert.alert(DELETE_CONFITM_TITLE, DELETE_CONFITM_CONTENT, [
        { text: "否", onPress: () => {} },
        {
          text: "是",
          onPress: () => {
            this.commit(
              {
                subEvents: [eventId]
              },
              null,
              null,
              response => {
                if (response.saveArticle && !this.props.article) {
                  let { subEvents, article } = response.saveArticle;
                  if (!_.isEmpty(subEvents)) {
                    let olderEdges = this.state.article.get("events");
                    _.remove(olderEdges.edges, (edge: Object) => {
                      return edge.node.id === _.first(subEvents);
                    });
                    // console.log(olderEdges.length);
                    // console.log(
                    //   _.remove(olderEdges.edges, (edge: Object) => {
                    //     return edge.node.id === _.first(subEvents);
                    //   })
                    // );
                    // console.log(olderEdges.length);
                    this.setState({
                      article: this.state.article
                        .set("events", olderEdges)
                        .set("id", article.id || article.__id)
                    });
                  }
                }
              }
            );
          }
        }
      ]);
    };
  };
}

const InputItem = (props: Object) => {
  const {
    title,
    value,
    onPress,
    fieldName,
    placeholder,
    tip,
    multiline,
    maxLength,
    showArrow = true,
    style = {},
    nodeId,
    deleteEvent,
    required = false
  } = props;
  let showText = "";
  if (_.isArray(value)) {
    showText = value.join("·");
  } else if (_.isObject(value)) {
    showText = `${value.province}·${value.city || ""}·${value.area || ""}`;
  } else {
    showText = value;
  }
  let isEvent = fieldName === "events";
  return (
    <View>
      <TouchableOpacity
        onPress={onPress({
          value,
          title,
          fieldName,
          placeholder,
          tip,
          multiline,
          maxLength,
          nodeId
        })}
      >
        <View
          style={[
            {
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal,
              paddingVertical: normalize(10),
              borderBottomWidth: StyleSheet.hairlineWidth / PixelRatio.get(),
              borderBottomColor: "#999999"
            },
            style
          ]}
        >
          <Text style={styles.itemTitle}>
            {required &&
              <Text style={{ color: "rgba(255,0,0,0.7)" }}>
                *
              </Text>}
            {title}
          </Text>
          {!multiline &&
            showArrow &&
            <Text
              style={{
                color: "#666666",
                marginBottom: 3,
                lineHeight: normalize(25)
              }}
            >
              {showText}
            </Text>}
          {showArrow &&
            <Icon
              name="ios-arrow-forward-outline"
              style={{ marginLeft: 10, color: "#999999" }}
              size={20}
            />}
        </View>
      </TouchableOpacity>
      {multiline &&
        showText &&
        <View
          style={{
            paddingHorizontal: paddingHorizontal + (isEvent ? 0 : 20),
            paddingVertical: 5,
            borderBottomWidth: StyleSheet.hairlineWidth / PixelRatio.get(),
            borderBottomColor: "#999999",
            justifyContent: "flex-end",
            flexDirection: "row"
          }}
        >
          <Text
            style={[
              {
                color: "#666666",
                marginBottom: 3,
                lineHeight: normalize(25)
              },
              isEvent ? { marginLeft: 30 } : {}
            ]}
          >
            {showText}
          </Text>
          {isEvent &&
            <TouchableOpacity onPress={deleteEvent} style={{ paddingLeft: 10 }}>
              <Icon name="ios-trash-outline" size={20} />
            </TouchableOpacity>}
        </View>}
    </View>
  );
};

class Attachment extends React.PureComponent {
  props: {
    source: Object,
    ossKey: string,
    done: boolean,
    deleteImage: (key: string) => void
  };
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.source !== nextProps.source ||
      this.props.done !== nextProps.done
    );
  }
  _deleteImage = (key: string) => {
    return () => {
      Alert.alert(DELETE_CONFITM_TITLE, DELETE_CONFITM_CONTENT, [
        { text: "否", onPress: () => {} },
        {
          text: "是",
          onPress: () => {
            this.props.deleteImage(key)();
          }
        }
      ]);
    };
  };
  render() {
    const { source, ossKey, done = false } = this.props;
    return (
      <View
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <ImageWraper
          loaderStyle={{ height: EDIT_SWIPER_HEIGHT, width: "100%" }}
          style={styles.avatar}
          source={source}
        />
        {done &&
          <TouchableOpacity
            style={{
              right: 5,
              top: 5,
              position: "absolute",
              backgroundColor: "#ffffff",
              width: 20,
              height: 20,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 2
            }}
            onPress={this._deleteImage(ossKey)}
          >
            <Icon color="rgba(231,76,60,1)" name="ios-trash" size={20} />
          </TouchableOpacity>}
        {!done &&
          <ActivityIndicator
            color="#ffffff"
            style={{
              right: 5,
              bottom: 5,
              position: "absolute"
            }}
            animating={true}
          />}
      </View>
    );
  }
}

class ImageSwiper extends React.PureComponent {
  props: {
    images: Object,
    del: () => void,
    deleteImage: (key: string) => () => {}
  };
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.images !== this.props.images;
  }
  render() {
    const { images, deleteImage } = this.props;
    return (
      <Swiper
        {...Platform.select({
          ios: {
            loadMinimalSize: 1,
            loadMinimal: true
          }
        })}
        height={EDIT_SWIPER_HEIGHT}
        style={styles.wrapper}
      >
        {images.toArray().map((img, index) => {
          return (
            <Attachment
              key={index}
              deleteImage={deleteImage}
              ossKey={img.get("key") || img.key}
              source={img.get("source") || img.source}
              done={img.get("done") || img.done}
            />
          );
        })}
      </Swiper>
    );
  }
}
