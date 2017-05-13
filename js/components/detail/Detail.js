import React from "react";
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
const {
  graphql,
  QueryRenderer,
  createFragmentContainer
} = require("react-relay");
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
import Swiper from "react-native-swiper";
import { environment as RelayEnvironment } from "../../config/Environment";
import { EmptyListLoading } from "../Loading";
import {
  caclateMarginHorizontal,
  paddingHorizontal,
  caclateCardWidth,
  getHeaderPadding
} from "../utils";
import {
  normalize,
  ArticleDetailTitle,
  ArticleDetailCardTitle,
  ArticleDetailCardMeta,
  Dot,
  ArticleFieldName,
  ArticleFieldValue
} from "../H8Text";
import {
  Header,
  ScrollContainer as PageContainer,
  SearchWraper,
  BackButton,
  TopHeader
} from "../common";
import { DETAIL_SWIPER_HEIGHT } from "../../constants";
import ImageWraper from "../ImageWraper";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#3385ff",
    height: normalize(90),
    paddingBottom: normalize(45)
  },
  _content: {
    marginHorizontal: caclateMarginHorizontal(),
    paddingHorizontal,
    flex: 1,
    width: "100%",
    marginBottom: normalize(15)
  },
  title: { flex: 1, marginHorizontal: normalize(10) },
  titleContent: {
    alignItems: "center",
    justifyContent: "center"
  },
  edit: {
    alignItems: "flex-end",
    marginLeft: normalize(5),
    paddingLeft: normalize(10)
  },
  card: {
    marginTop: -normalize(45),
    width: "100%",
    padding: normalize(10),
    marginBottom: normalize(15),
    ...Platform.select({
      ios: {
        shadowRadius: 2,
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowOffset: { height: 1, width: 1 }
      },
      android: {
        backgroundColor: "#ffffff"
      }
    })
  },
  section: {
    marginHorizontal: caclateMarginHorizontal(),
    paddingHorizontal
  },
  cardTitle: {
    marginBottom: normalize(5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  dot: {
    fontSize: normalize(10)
  },
  meta: {
    marginTop: normalize(5)
  },
  fieldName: {},
  fieldCard: {
    marginBottom: normalize(15)
  },
  miniHeader: {
    height: 0,
    backgroundColor: "#3385ff",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal,
    left: 0,
    right: 0
  },
  wrapper: {},
  image: {
    width: Dimensions.get("window").width - 2 * paddingHorizontal,
    height: DETAIL_SWIPER_HEIGHT
  },
  fullScreenImg: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height
  }
});
class Detail extends React.Component {
  props: {
    node: Object
  };
  constructor(props) {
    super(props);
    this.state = {
      scrollTop: new Animated.Value(0),
      filters: {},
      showBigImg: false,
      imageIndex: 0
    };
  }
  componentDidMount() {
    const { filters } = this.props.navigation.state.params;
    this.setState({ filters });
  }
  editIt = (id: string) => {
    return () => {
      this.props.navigation.navigate("Add", {
        id,
        filters: this.state.filters
      });
    };
  };
  hideBigImg = (): void => {
    this.setState({
      showBigImg: false
    });
  };
  showBigImg = (uri: string, index: number): void => {
    return () => {
      // console.log("showBigImg");
      this.setState({
        showBigImg: true,
        imageIndex: index
      });
    };
  };
  render() {
    // console.log(
    //   "detail renderdetail renderdetail renderdetail renderdetail render "
    // );
    if (!this.props.node) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={{ fontWeight: "500" }}>该案例不存在</Text>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.goBack(null);
            }}
          >
            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginVertical: 20
              }}
            >
              <Text style={{ color: "#666666" }}>
                返回
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    const {
      node: {
        marriage,
        education,
        homePlace,
        gender,
        birthday,
        categories = [],
        title,
        name,
        jobs,
        knowledge,
        children,
        events,
        notes,
        createdAt,
        id,
        attachments_maxw,
        attachments_wh
      }
    } = this.props;
    return (
      <View style={{ flex: 1, backgroundColor: "#f7f8fa" }}>
        <TopHeader />
        <Animated.View
          style={[
            styles.miniHeader,
            {
              opacity: this.state.scrollTop.interpolate({
                inputRange: [0, 200, 220],
                outputRange: [0, 0, 1],
                extrapolate: "clamp"
              }),
              top: this.state.scrollTop.interpolate({
                inputRange: [0, 200, 220],
                outputRange: [-normalize(45), -normalize(45), 0],
                extrapolate: "clamp"
              }),
              height: this.state.scrollTop.interpolate({
                inputRange: [0, 200, 220],
                outputRange: [0, 0, normalize(45)],
                extrapolate: "clamp"
              })
            }
          ]}
        >
          <BackButton navigation={this.props.navigation} color="#ffffff" />
          <ScrollView
            horizontal={true}
            style={styles.title}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.titleContent}
          >
            <ArticleDetailTitle style={{ color: "#ffffff" }}>
              {title}
            </ArticleDetailTitle>
          </ScrollView>
          <TouchableOpacity onPress={this.editIt(id)}>
            <View style={styles.edit}>
              <Icon size={normalize(20)} name="ios-create" color="#ffffff" />
            </View>
          </TouchableOpacity>
        </Animated.View>
        <PageContainer
          onScroll={({ nativeEvent }) =>
            this.state.scrollTop.setValue(nativeEvent.contentOffset.y)}
          contentContainerStyle={{ alignItems: "center" }}
          scrollEventThrottle={100}
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        >
          <Header style={styles.header}>
            <BackButton navigation={this.props.navigation} color="#ffffff" />
            <ScrollView
              horizontal={true}
              style={styles.title}
              contentContainerStyle={styles.titleContent}
              showsHorizontalScrollIndicator={false}
            >
              <ArticleDetailTitle style={{ color: "#ffffff" }}>
                {title}
              </ArticleDetailTitle>
            </ScrollView>
            <TouchableOpacity onPress={this.editIt(id)}>
              <View style={styles.edit}>
                <Icon size={normalize(20)} name="ios-create" color="#ffffff" />
              </View>
            </TouchableOpacity>
          </Header>
          <View style={styles._content}>
            <View style={styles.card}>
              <View style={styles.cardTitle}>
                <ArticleDetailCardTitle>
                  {name} <Dot>({gender}·{marriage})</Dot>
                </ArticleDetailCardTitle>
                <ArticleDetailCardMeta>
                  {moment(birthday).format("YYYY-MM-DD hh:mm")}
                </ArticleDetailCardMeta>
              </View>
              <ArticleDetailCardMeta>
                {categories && categories.join("·")}
                -
                {jobs && jobs.join("·")}
                -
                {education}
              </ArticleDetailCardMeta>
              {homePlace &&
                <ArticleDetailCardMeta style={styles.meta}>
                  {homePlace.province}·{homePlace.city}·{homePlace.area}
                </ArticleDetailCardMeta>}
            </View>
            {attachments_maxw &&
              attachments_maxw.length > 0 &&
              <Swiper
                {...Platform.select({
                  ios: {
                    loadMinimalSize: 1,
                    loadMinimal: true
                  }
                })}
                height={DETAIL_SWIPER_HEIGHT}
                style={styles.wrapper}
              >
                {attachments_maxw.map((img, index) => (
                  <TouchableWithoutFeedback
                    key={`img_${index}`}
                    onPress={this.showBigImg(
                      img.replace("http", "https"),
                      index
                    )}
                  >
                    <ImageWraper
                      style={styles.image}
                      source={{ uri: img.replace("http", "https") }}
                    />
                  </TouchableWithoutFeedback>
                ))}
              </Swiper>}
            <View style={styles.section}>
              <FieldCard title="子女情况" value={children} />
              <FieldCard title="命理知识备注" value={knowledge} />
              <FieldCard title="重要事件" edges={events.edges} />
              <FieldCard title="后续备注" edges={notes.edges} />
            </View>
            <ArticleDetailCardMeta style={{ alignSelf: "flex-end" }}>
              {moment(createdAt).fromNow()}
            </ArticleDetailCardMeta>
          </View>
        </PageContainer>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.showBigImg}
          animationType="none"
          onRequestClose={() => this.setState({ showBigImg: false })}
        >
          <ImageSwiper
            attachments_maxw={attachments_maxw}
            index={this.state.imageIndex}
            attachments={attachments_wh}
            hideBigImg={this.hideBigImg}
          />
        </Modal>
      </View>
    );
  }
}

const FieldCard = props => {
  const { title, value, edges } = props;
  return (
    <View style={styles.fieldCard}>
      <View style={styles.fieldName}>
        <ArticleFieldName>{title}：</ArticleFieldName>
      </View>
      {value && <ArticleFieldValue>{value}</ArticleFieldValue>}
      {edges &&
        edges.map((edge, index) => (
          <ArticleFieldValue key={edge.node.id}>
            {index + 1}. {edge.node.text}
          </ArticleFieldValue>
        ))}
    </View>
  );
};

class ImageSwiper extends React.PureComponent {
  props: {
    attachments?: string[],
    attachments_maxw?: string[],
    index: number,
    hideBigImg: () => void
  };
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.attachments !== this.props.attachments ||
      this.state.loading !== nextState.loading
    );
  }
  render() {
    const { attachments = [], index = 0, attachments_maxw } = this.props;
    if (!attachments || attachments.length === 0) {
      return null;
    }
    if (Platform.OS === "android") {
      return (
        <ImageWraper
          resizeMode="stretch"
          style={styles.fullScreenImg}
          defaultSourceStyle={styles.image}
          defaultSource={{
            uri: attachments_maxw[index].replace("http", "https")
          }}
          source={{
            uri: attachments[index].replace("http", "https")
          }}
        />
      );
    }
    return (
      <Swiper
        index={index}
        loadMinimalSize={1}
        loadMinimal={true}
        style={styles.wrapper}
      >
        {attachments.map((img, index) => (
          <TouchableWithoutFeedback
            onPress={this.props.hideBigImg}
            key={`img_${index}`}
          >
            <ImageWraper
              resizeMode="stretch"
              style={styles.fullScreenImg}
              source={{
                uri: img.replace("http", "https")
              }}
            />
          </TouchableWithoutFeedback>
        ))}
      </Swiper>
    );
  }
}

const Container = createFragmentContainer(Detail, {
  node: graphql`
    fragment Detail_node on Article {
      id,
      attachments_maxw(width: $width),
      attachments_wh(width:$fullWidth, height:$fullHeight, m: $m),
      title,
      categories,
      name,
      education,
      gender,
      birthday,
      homePlace {
        province,
        city,
        area
      },
      jobs,
      marriage,
      children,
      events(first: 10) @connection(key: "article_events") {
        edges {
          node {
            id,
            text,
            createdAt,
          }
        }
      },
      knowledge,
      notes(first: 10) @connection(key: "article_notes") {
        edges {
          node {
            id,
            text,
            createdAt,
          }
        }
      },
      createdAt
    }
  `
});

export default _props => {
  const params = _props.navigation.state.params;
  const id = params ? params.id : null;
  if (!id) {
    return null;
  }
  return (
    <QueryRenderer
      query={graphql`
        query DetailQuery($articleId: ID!, $width: Int!, $fullHeight: Int!, $fullWidth: Int!, $m: String) {
          node(id: $articleId) {
            ...Detail_node
          }
        }
      `}
      variables={{
        articleId: id,
        width: Dimensions.get("window").width - 2 * paddingHorizontal,
        fullHeight: Dimensions.get("window").height,
        fullWidth: Dimensions.get("window").width,
        m: "m_pad"
      }}
      environment={RelayEnvironment.current}
      render={({ error, props, rest }) => {
        if (props) {
          return <Container {..._props} node={props.node} />;
        } else {
          return <EmptyListLoading style={{ height: "100%" }} />;
        }
      }}
    />
  );
};
