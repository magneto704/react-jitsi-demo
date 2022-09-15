import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import {
  Button,
  Stack,
  Grid,
  Container,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const App = () => {
  const displayName = "นายวิชัย บุบผามะตะนัง";
  const [muted, setMuted] = React.useState(false);
  const [api, setApi] = React.useState(null);
  const [participantsInfo, setParticipantsInfo] = React.useState(null);

  const handleExcuteCommand = (command) => {
    api.executeCommand(command);
  };

  return (
    <>
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          <Grid item container spacing={2} xs={10}>
            <Grid item xs={12}>
              <Typography variant="body1">
                สถานะไมค์ : {muted ? "เปิดไมค์" : "ปิดไมค์"}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <JitsiMeeting
                domain={`testjitsi.ddns.net`}
                roomName="test"
                configOverwrite={{
                  startWithAudioMuted: true,
                  disableModeratorIndicator: false,
                  startScreenSharing: true,
                  enableEmailInStats: false,
                  disableSelfView: false,
                  // disableFilmstripAutohiding: true,
                  filmstrip: {
                    disableResizable: true,
                    minParticipantCountForTopPanel: 50,
                  },
                }}
                spinner={() => <h1>รอสักครู่....</h1>}
                interfaceConfigOverwrite={{
                  VIDEO_LAYOUT_FIT: "nocrop",
                  DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                  // DEFAULT_BACKGROUND: "#BDF0FF",
                  // VERTICAL_FILMSTRIP: false
                }}
                userInfo={{
                  email: "wichai.b@lexnetix.co.th",
                  displayName,
                }}
                onApiReady={(externalApi) => {
                  externalApi.on("audioMuteStatusChanged", (state) => {
                    setMuted(!state.muted);
                  });

                  externalApi.on("raiseHandUpdated", (state) => {
                    alert("มีผู้ประท้วง");
                  });

                  externalApi.executeCommand(
                    "avatarUrl",
                    "https://i.pinimg.com/236x/cf/74/1a/cf741a56f200041630642387a61ac31c.jpg"
                  );
                  externalApi.executeCommand("overwriteConfig", {
                    toolbarButtons: [],
                  });

                  // externalApi.get

                  // here you can attach custom event listeners to the Jitsi Meet External API
                  // you can also store it locally to execute commands
                  setApi(externalApi);
                }}
                getIFrameRef={(iframeRef) => {
                  iframeRef.style.height = "80vh";
                }}
              />
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
            <List>
              {(participantsInfo ? participantsInfo.participants : []).map(
                (data, index) => {
                  return (
                    <React.Fragment key={index}>
                      <ListItem>
                        <ListItemText
                          primary={data.displayName}
                          secondary={data.id}
                        />
                      </ListItem>
                    </React.Fragment>
                  );
                }
              )}
            </List>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default App;
