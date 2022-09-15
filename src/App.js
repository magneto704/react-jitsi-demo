import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  ListItemButton,
  Divider,
} from "@mui/material";

import "./App.css";

const App = () => {
  const [participantNumber, setParticipantNumber] = React.useState(0);
  const [displayName, setDisplayName] = React.useState("วิชัย บุบผามะตะนัง");
  const [muted, setMuted] = React.useState(false);
  const [api, setApi] = React.useState(null);
  const [participantsInfo, setParticipantsInfo] = React.useState([]);

  const handleExcuteCommand = (command) => {
    api.executeCommand(command);
  };

  const sendRequestApprove = (id) => {
    console.log("Send", " ", id);
    api.executeCommand(
      "sendEndpointTextMessage",
      id,
      "{type: 'approve', message: 'ข้อประท้วง'}"
    );
  };

  // open dialog
  const [open, setOpen] = React.useState(true);
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      {!open && (
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            <Grid item container spacing={2} xs={10}>
              <Grid item xs={12}>
                <Typography variant="body1">
                  สถานะไมค์ : {muted ? "เปิดไมค์" : "ปิดไมค์"}
                </Typography>
                <Typography variant="body1">
                  จำนวนผู้เข้าร่วมประชุม :{participantNumber}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <JitsiMeeting
                  domain={`testjitsi.ddns.net`}
                  roomName="demo"
                  configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: false,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    disableSelfView: false,
                    apiLogLevels: ["warn"],
                    disableFilmstripAutohiding: true,
                    filmstrip: {
                      disableResizable: true,
                      disableStageFilmstrip: true,
                      doNotFlipLocalVideo: true,
                    },
                  }}
                  spinner={() => <h1>รอสักครู่....</h1>}
                  interfaceConfigOverwrite={{
                    VIDEO_LAYOUT_FIT: "height",
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    // TILE_VIEW_MAX_COLUMNS: 1,
                    CLOSE_PAGE_GUEST_HINT: true,
                    HIDE_INVITE_MORE_HEADER: true,
                    // DEFAULT_BACKGROUND: "#BDF0FF",
                    VERTICAL_FILMSTRIP: false,
                  }}
                  userInfo={{
                    email: "wichai.b@lexnetix.co.th",
                    displayName,
                  }}
                  onApiReady={(externalApi) => {
                    externalApi.on("audioMuteStatusChanged", (state) => {
                      setMuted(!state.muted);
                    });

                    // ตัวเราเข้าประชุม
                    externalApi.on("videoConferenceJoined", (state) => {
                      // เพิ่มรายชือผู้เข้ารวมประชุม
                      setParticipantsInfo(externalApi.getParticipantsInfo());

                      const numberOfParticipants =
                        externalApi.getNumberOfParticipants();
                      setParticipantNumber(numberOfParticipants);

                      externalApi.executeCommand("toggleTileView");
                    });

                    // สมาชิก เข้า - ออก
                    externalApi.on("participantJoined", (state) => {
                      // เพิ่มรายชือผู้เข้ารวมประชุม
                      setParticipantsInfo(externalApi.getParticipantsInfo());

                      const numberOfParticipants =
                        externalApi.getNumberOfParticipants();
                      setParticipantNumber(numberOfParticipants);
                    });

                    externalApi.on("participantLeft", (state) => {
                      // ลบรายชือผู้เข้ารวมประชุม
                      setParticipantsInfo(externalApi.getParticipantsInfo());

                      const numberOfParticipants =
                        externalApi.getNumberOfParticipants();
                      setParticipantNumber(numberOfParticipants);
                    });

                    // รับข้อความ
                    externalApi.on("endpointTextMessageReceived", (state) => {
                      alert(JSON.stringify(state.data.eventData.text));
                    });

                    externalApi.on("raiseHandUpdated", (state) => {
                      const id = state.id;
                      alert(
                        externalApi.getDisplayName(id) + " ->  ยกมือประท้วง"
                      );
                    });

                    // const displayName = externalApi.getDisplayName(participantId);
                    // console.log(displayName);

                    externalApi.executeCommand(
                      "avatarUrl",
                      "https://i.pinimg.com/236x/cf/74/1a/cf741a56f200041630642387a61ac31c.jpg"
                    );
                    externalApi.executeCommand("overwriteConfig", {
                      toolbarButtons: [],
                    });

                    externalApi.executeCommand("toggleParticipantsPane", false);

                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // you can also store it locally to execute commands
                    setApi(externalApi);
                  }}
                  getIFrameRef={(iframeRef) => {
                    iframeRef.style.height = "80vh";
                  }}
                />
                {/* <div id="jitisMeeing-2">{api.getIFrame()}</div> */}
              </Grid>
              <Grid item xs={12} container columnGap={2}>
                <Button
                  variant="contained"
                  onClick={() => handleExcuteCommand("toggleVideo")}
                >
                  ปิด/เปิด กล้อง
                </Button>

                <Button
                  variant="contained"
                  onClick={() => {
                    handleExcuteCommand("toggleAudio");
                    // handleExcuteCommand("toggleSubtitles");
                  }}
                >
                  ปิด/เปิด ไมค์
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleExcuteCommand("toggleFilmStrip")}
                >
                  ปิด/เปิด ผู้ประชุม
                </Button>

                <Button
                  variant="contained"
                  onClick={() => handleExcuteCommand("toggleRaiseHand")}
                >
                  ยกมือ
                </Button>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <List
                subheader={
                  <ListSubheader component="div">
                    รายชื่อผู้ประชุม
                  </ListSubheader>
                }
              >
                {(participantsInfo ? participantsInfo : []).map(
                  (data, index) => {
                    return (
                      <React.Fragment key={index}>
                        <ListItemButton
                          onClick={() => sendRequestApprove(data.participantId)}
                        >
                          <ListItemText
                            primary={data.formattedDisplayName}
                            secondary={data.participantId}
                          />
                        </ListItemButton>
                        <Divider />
                      </React.Fragment>
                    );
                  }
                )}
              </List>
            </Grid>
          </Grid>
        </Container>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Typography variant="body1">ตั้งค่าใช้งานระบบ</Typography>
        </DialogTitle>
        <DialogContent sx={{ width: "550px" }}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            spacing={2}
          >
            <Grid item xs={9} md={10}>
              <TextField
                placeholder="ระบุชื่อ"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3} md={2}>
              <Button
                variant="contained"
                sx={{ height: "50px", width: "80px" }}
                onClick={() => {
                  if (displayName == "") {
                    alert("ระบุข้อมูลชื่อผู้ใช้งาน!");
                  } else {
                    setOpen(false);
                  }
                }}
              >
                <Typography variant="body1">ตกลง</Typography>
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default App;
