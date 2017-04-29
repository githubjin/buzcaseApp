import React from "react";
import { Text, View, ScrollView, StyleSheet, Animated } from "react-native";
const {
  graphql,
  QueryRenderer,
  createFragmentContainer
} = require("react-relay");
import Icon from "react-native-vector-icons/Ionicons";
import moment from "moment";
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
    shadowRadius: 2,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowOffset: { height: 1, width: 1 },
    marginBottom: normalize(15)
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
  }
});
class Detail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollTop: new Animated.Value(0)
    };
  }
  render() {
    console.log(
      "detail renderdetail renderdetail renderdetail renderdetail render "
    );
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
        createdAt
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
            contentContainerStyle={styles.titleContent}
          >
            <ArticleDetailTitle style={{ color: "#ffffff" }}>
              {title}
            </ArticleDetailTitle>
          </ScrollView>
          <View style={styles.edit}>
            <Icon size={normalize(20)} name="ios-create" color="#ffffff" />
          </View>
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
            <View style={styles.edit}>
              <Icon size={normalize(20)} name="ios-create" color="#ffffff" />
            </View>
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
                {categories.join("·")} - {jobs.join("·")} - {education}
              </ArticleDetailCardMeta>
              {homePlace &&
                <ArticleDetailCardMeta style={styles.meta}>
                  {homePlace.province}·{homePlace.city}·{homePlace.area}
                </ArticleDetailCardMeta>}
            </View>
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

const Container = createFragmentContainer(Detail, {
  node: graphql`
    fragment Detail_node on Article {
      id,
      attachments,
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
      events {
        edges {
          node {
            id,
            text,
            createdAt,
          }
        }
      },
      knowledge,
      notes {
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
        query DetailQuery($articleId: ID!) {
          node(id: $articleId) {
            ...Detail_node
          }
        }
      `}
      variables={{
        articleId: id
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
