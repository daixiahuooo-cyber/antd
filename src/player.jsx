import { Player, ControlBar, ReplayControl, ForwardControl } from 'video-react';
export default function VideoPlayer() {
    return (
        <Player
            fluid={false}
            width={600}
            height={400}
            muted={true}
            autoPlay={false}
            poster='https://upload.wikimedia.org/wikipedia/commons/6/69/Sintel_Cover_Durian_Project.jpg'
            src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
        >
            <ControlBar autoHide={false}>
                <ReplayControl seconds={5} order={2.1} />
                <ReplayControl seconds={10} order={2.2} />
                <ReplayControl seconds={30} order={2.3} />
                <ForwardControl seconds={5} order={3.1} />
                <ForwardControl seconds={10} order={3.2} />
                <ForwardControl seconds={30} order={3.3} />
            </ControlBar>
        </Player>
    );
}