import DataPortion from "../../models/sending/portions/data-portion";
import Session from "../../models/sessions/session";
import DataType from "../../models/sending/portions/data-type";
import HeadPayload from "../../models/sending/portions/payloads/head-payload";

const path = require('path');

class SessionsState {

    private readonly sessions: any = {};

    public getSession(portion: DataPortion):  Session{

        const session = this.getInnerSession(portion);

        if (portion.type === DataType.head) {

            const payload = <HeadPayload>portion.payload;

            session.fileName = path.basename(payload.fileName);
        }

        return session;
    }

    private getInnerSession(portion: DataPortion):  Session {

        if (this.sessions[portion.sessionId]) {
            return this.sessions[portion.sessionId];
        }

        const session = new Session(portion.sessionId);
        this.sessions[portion.sessionId] = session;

        return session;
    }

    public finishSession(session: Session) {
        delete this.sessions[session.id];
    }
}

export default SessionsState;