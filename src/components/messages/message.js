import Question from "components/messages/question";
import Response from "components/messages/response";

const Message = (props) => {
  switch (props.message_type) {
    case "Q":
      return Question(props);
    case "R":
      return Response(props);
    default:
      return <></>;
  }
};

export default Message;
