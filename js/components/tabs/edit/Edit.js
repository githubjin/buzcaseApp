// @flow
import React from "react";
import {
  Text,
  View,
  ScrollView,
  Button,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Image,
  Alert,
  PixelRatio,
  InteractionManager
} from "react-native";
import moment from "moment";
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
import { caclateMarginHorizontal, paddingHorizontal } from "../../utils";
import { endPoint, bucketName } from "./config";
import { commit } from "./ArticleMutation";
import { dic_add_bnt_font_size } from "../../H8Size";
import {
  ERROR_TITLE,
  UPLOAD_ERROR_CONTENT,
  CAMERA_ERROR
} from "../../../constants";

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
  }
});
export default class Add extends React.Component {
  props: {
    article: Object
  };
  constructor(props) {
    super(props);
    this.state = {
      images: Immutatble.List([]),
      article: Immutatble.Map({}),
      birthdayDate: "",
      birthdayTime: ""
    };
  }
  componentWillReceiveProps(nextProps) {
    console.log("nextPropsnextPropsnextPropsnextProps : ", nextProps);
  }
  componentDidMount() {
    this.initOss();
    let { birthday } = this.props.article || {};
    this.setState({
      article: Immutatble.Map(this.props.article || { events: { edges: [] } }),
      birthdayDate: birthday ? moment(birthday).format("YYYY-MM-DD") : "",
      birthdayTime: birthday ? moment(birthday).format("a hh:mm") : ""
    });
  }
  initOss = () => {
    const {
      viewer: {
        ossToken: {
          Expiration,
          AccessKeyId,
          SecurityToken,
          AccessKeySecret,
          dir
        } = {}
      } = {}
    } = this.props;
    AliyunOSS.enableOSSLog();
    const config = {
      AccessKey: AccessKeyId,
      SecretKey: AccessKeySecret,
      SecretToken: SecurityToken
    };
    AliyunOSS.initWithKey(config, endPoint);
  };
  upload = sourceFile => {
    const { viewer: { ossToken: { dir } = {} } = {} } = this.props;
    let suffix = this.getImageFilenameMeta(sourceFile).suffix;
    const uploadConfig = {
      bucketName,
      sourceFile,
      ossFile: `${dir}/${uuidV4()}.${suffix}`
    };
    AliyunOSS.addEventListener(
      "uploadProgress",
      this.uploadProgress(sourceFile)
    );
    AliyunOSS.uploadObjectAsync(uploadConfig)
      .then(resp => {
        // resp is true
        // console.log("resprespresprespresprespresp : ", resp);
        AliyunOSS.removeEventListener(
          "uploadProgress",
          this.uploadProgress(sourceFile)
        );
      })
      .catch(error => {
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
  uploadProgress = sourceFile => {
    return p => {
      let name = this.getImageFilenameMeta(sourceFile).name;
      let obj = {};
      obj[`percent_${name}`] = p.currentSize / p.totalSize;
      this.setState(obj);
    };
  };
  getUploadProgess = (uri: string) => {
    let name = this.getImageFilenameMeta(uri).name;
    console.log(`percent_${name}`, this.state[`percent_${name}`]);
    return this.state[`percent_${name}`];
  };
  loadImg = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: "photo",
      width: 300,
      height: 400
    })
      .then((images: Object[]) => {
        // console.log("images : ", images);
        let arr = images.map(img => {
          // this.upload(img.path);
          return { uri: img.path };
        });
        if (arr.length > 0) {
          this.setState({
            images: this.state.images.push(...arr)
          });
        }
      })
      .catch(error => {
        console.log("error : ", error);
      });
  };
  camera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true
    })
      .then((images: Object[]) => {
        // console.log("images : ", images);
        let arr = images.map(img => ({ uri: img.path }));
        if (arr.length > 0) {
          this.setState({
            images: this.state.images.push(...arr)
          });
        }
      })
      .catch(error => {
        Alert.alert(ERROR_TITLE, CAMERA_ERROR);
      });
  };
  setBirthday = (b: boolean) => {
    return date => {
      console.log("datedatedatedatedate is ", date);
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
      console.log("birthdaybirthdaybirthdaybirthday is ", birthday);
      if (birthday) {
        InteractionManager.runAfterInteractions(() => {
          this.commit(
            {
              id: this.state.article.get("id") || "new",
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
    ImagePicker.clean()
      .then(() => {
        console.log("removed all tmp images from tmp directory");
      })
      .catch(e => {
        console.log("removed all tmp images from tmp directory error : ", e);
      });
  }
  onBack = (
    args: {
      fieldName: string,
      newValue: string | string[],
      nodeId: string,
      multiple: boolean
    }
  ) => {
    let _newValue = args.newValue;
    if (args.fieldName === "events" && _.isEmpty(args.nodeId)) {
      return this.addNewEvent(_newValue);
    }
    this.commit(
      {
        id: this.state.article.get("id") || "new",
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
  addNewEvent = (text: string) => {
    this.commit(
      {
        id: this.state.article.get("id") || "new",
        addEvents: [text]
      },
      null,
      null,
      response => {
        // console.log(response);
        if (response.saveArticle) {
          let { newEvents, article } = response.saveArticle;
          if (!_.isEmpty(newEvents)) {
            let olderEdges = this.state.article.get("events");
            console.log(_.concat(olderEdges.edges, newEvents));
            this.setState({
              article: this.state.article
                .set("events", {
                  edges: _.concat(olderEdges.edges, newEvents)
                })
                .set("id", article.id)
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
    onComplete: (response: Object) => void
  ): void => {
    commit(this.props.relay.environment, this.props.viewer, input, response => {
      // console.log(response);
      if (response.saveArticle && fieldName && newValue) {
        this.setState({
          article: this.state.article
            .set(fieldName, newValue)
            .set("id", response.saveArticle.article.id)
        });
      }
      if (onComplete) {
        onComplete(response);
      }
    });
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
    const { viewer: { ossToken = {} } = {} } = this.props;
    const { article } = this.state;
    const events = article.get("events");
    const { edges = [] } = events || {};
    // console.log("eventseventseventseventsevents : ", JSON.stringify(events));
    let showSwiper = this.state.images.size > 0;
    return (
      <View style={styles.container}>
        <ScrollView>
          {showSwiper &&
            <Swiper height={150} style={styles.wrapper}>
              {this.state.images
                .toArray()
                .map((img, index) => (
                  <Attachment
                    key={index}
                    percent={this.getUploadProgess(img.uri)}
                    source={img}
                  />
                ))}
            </Swiper>}
          <View style={styles.imageActions}>
            <TouchableOpacity onPressIn={this.camera}>
              <View style={styles.imageAction}>
                <Icon name="md-camera" style={styles.actionButtonIcon} />
                <Text>命盘拍照</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.spliter} />
            <TouchableOpacity onPress={this.loadImg}>
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
          />
          <InputItem
            fieldName="categories"
            title="类别"
            multiline={true}
            value={this.state.article.get("categories")}
            onPress={this.editSelect("Category", true)}
          />
          <InputItem
            placeholder="姓名/昵称"
            fieldName="name"
            title="姓名/昵称"
            maxLength={50}
            tip="最多输入50字内容"
            value={this.state.article.get("name")}
            onPress={this.editText}
          />
          <InputItem
            fieldName="gender"
            title="性别"
            value={this.state.article.get("gender")}
            onPress={this.editSelect("Gender")}
          />
          <InputItem
            fieldName="birthday"
            title="出生时间"
            value=""
            showArrow={false}
            onPress={() => {}}
            style={{ borderBottomWidth: 0 }}
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
          />
          <InputItem
            fieldName="education"
            title="学历"
            value={this.state.article.get("education")}
            onPress={this.editSelect("Education")}
          />
          <InputItem
            fieldName="jobs"
            title="职业"
            value={this.state.article.get("jobs")}
            onPress={this.editSelect("Job", true)}
          />
          <InputItem
            fieldName="marriage"
            title="婚姻"
            value={this.state.article.get("marriage")}
            onPress={this.editSelect("Marriage")}
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
    nodeId
  } = props;
  let showText = "";
  if (_.isArray(value)) {
    showText = value.join("·");
  } else if (_.isObject(value)) {
    showText = `${value.province}·${value.city}·${value.area}`;
  } else {
    showText = value;
  }
  return (
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
      <View>
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
          <Text
            style={{ flex: 1, fontWeight: "400", lineHeight: normalize(25) }}
          >
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
        {multiline &&
          showText &&
          <View
            style={{
              paddingHorizontal: paddingHorizontal + 20,
              paddingVertical: 5,
              borderBottomWidth: StyleSheet.hairlineWidth / PixelRatio.get(),
              borderBottomColor: "#999999",
              alignItems: "flex-end"
            }}
          >
            <Text
              style={{
                color: "#666666",
                marginBottom: 3,
                lineHeight: normalize(25)
              }}
            >
              {showText}
            </Text>
          </View>}
      </View>
    </TouchableOpacity>
  );
};

class Attachment extends React.PureComponent {
  props: {
    percent: number,
    source: Object
  };
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     progress: 0
  //   };
  // }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      this.props.percent !== nextProps.percent ||
      this.props.source !== nextProps.source
      // this.state.progress !== nextState.progress
    );
  }
  // componentDidMount() {
  //   setInterval(
  //     function() {
  //       this.setState({ progress: this.state.progress + 0.4 * Math.random() });
  //     }.bind(this),
  //     1000
  //   );
  // }
  render() {
    const { percent = 0, source } = this.props;
    let showText = `${Math.floor(percent * 100)}%`;
    return (
      <View
        style={{
          width: "100%",
          height: "100%"
        }}
      >
        <Image style={styles.avatar} source={source} />
        <Text
          style={{
            fontSize: 20,
            color: "#ffffff",
            right: 0,
            bottom: 0,
            position: "absolute"
          }}
        >
          {showText}
        </Text>
      </View>
    );
  }
}
