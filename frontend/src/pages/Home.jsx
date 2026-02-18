import { Layout, Card, Row, Col, Typography, Button } from "antd";
import {
  MailFilled,
  ProfileFilled,
  FileAddFilled,
  SendOutlined,
  SafetyCertificateFilled,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh", background: "#F5F7FB" }}>
      <Header style={{ background: "#F5F7FB", padding: "0 50px" }}>
        <div style={{ color: "#001529", fontSize: "24px", fontWeight: "bold" }}>
          TBD
        </div>
      </Header>

      <Content
        style={{
          padding: "50px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          background: "#F5F7FB",
        }}
      >
        <div style={{ width: "100%", maxWidth: "80vw", marginTop: "80px" }}>
          <Row
            justify="center"
            style={{ marginBottom: "50px", textAlign: "center" }}
          >
            <Col>
              <Title
                level={2}
                style={{
                  fontWeight: 600,
                  color: "#111827",
                  letterSpacing: "-0.5px",
                  lineHeight: 1.3,
                  marginBottom: 12,
                }}
              >
                Automated Reports. Standardized Design.{" "}
                <span style={{ color: "#15803D" }}>
                  Zero Formatting Headaches
                </span>
                .
              </Title>
              <Text
                style={{ fontSize: 16, color: "#6B7280", textAlign: "center" }}
              >
                Generate daily E2E status updates and sign-off emails in
                seconds.
              </Text>
            </Col>
          </Row>

          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Row gutter={[32, 32]} justify="center">
              <Col xs={24} sm={24} md={12} lg={10}>
                <Card
                  style={{
                    height: "100%",
                    borderRadius: "16px",
                    boxShadow:
                      "0 4px 6px rgba(0, 0, 0, 0.04), 0 12px 24px rgba(37, 99, 235, 0.10)",
                    maxWidth: "320px",
                    margin: "0 auto",
                    padding: "40px 30px",
                    background:
                      "linear-gradient(135deg, rgb(246 249 255) 0%, rgb(219 231 255) 100%)",
                    border: "1px solid #E3EAF5",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  bodyStyle={{ padding: 0 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 16px rgba(0, 0, 0, 0.06), 0 18px 35px rgba(37, 99, 235, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.04), 0 12px 24px rgba(37, 99, 235, 0.10)";
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Title
                      level={3}
                      style={{
                        color: "#333",
                        marginBottom: "16px",
                        fontWeight: "600",
                      }}
                    >
                      E2E Daily Status Email
                    </Title>
                    <div
                      style={{
                        color: "#333",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        textAlign: "left",
                        padding: "0 20px",
                      }}
                    >
                      <div>✓ Instant report creation</div>
                      <div>✓ One-click email sending</div>
                      <div>✓ Standard email design</div>
                      <div>✓ No manual reporting effort</div>
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      icon={<SendOutlined />}
                      style={{
                        fontSize: "15px",
                        background: "linear-gradient(135deg, #2563EB, #1E4FD8)",
                        color: "white",
                        border: "none",
                        marginTop: "24px",
                        width: "100%",
                        height: "48px",
                        fontWeight: "600",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                      onClick={() => navigate("/status")}
                    >
                      Send Daily Status Email
                    </Button>
                  </div>
                </Card>
              </Col>

              <Col xs={24} sm={24} md={12} lg={10}>
                <Card
                  // hoverable
                  style={{
                    height: "100%",
                    borderRadius: "16px",
                    boxShadow: "0 12px 24px rgba(22, 163, 74, 0.10)",
                    maxWidth: "320px",
                    margin: "0 auto",
                    padding: "40px 30px",
                    background:
                      "linear-gradient( 135deg, rgb(240 253 244) 0%, rgb(209 250 229) 100% )",
                    border: "1px solid #D1FAE5",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  bodyStyle={{ padding: 0 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 18px 35px rgba(22, 163, 74, 0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(22, 163, 74, 0.10)";
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    <Title
                      level={3}
                      style={{
                        color: "#333",
                        marginBottom: "16px",
                        fontWeight: "600",
                      }}
                    >
                      E2E Sign Off Email
                    </Title>
                    <div
                      style={{
                        color: "#333",
                        fontSize: "14px",
                        lineHeight: "1.8",
                        textAlign: "left",
                        padding: "0 20px",
                      }}
                    >
                      <div>✓ Instant sign off report creation</div>
                      <div>✓ One-click email sending</div>
                      <div>✓ Recommended email format</div>
                      <div>✓ No manual reporting effort</div>
                    </div>
                    <Button
                      type="primary"
                      size="large"
                      icon={<SendOutlined />}
                      style={{
                        fontSize: "15px",
                        background: "linear-gradient(135deg, #16A34A, #15803D)",
                        color: "white",
                        // background: 'lightgrey',
                        // color: 'grey',
                        opacity: 0.7,
                        border: "none",
                        marginTop: "24px",
                        width: "100%",
                        height: "48px",
                        fontWeight: "600",
                        borderRadius: "10px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                      // onClick={() => navigate('/completion')}
                    >
                      Send Sign Off Email
                      {/* Coming Soon */}
                    </Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Home;
