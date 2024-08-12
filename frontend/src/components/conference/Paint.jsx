import { Tldraw } from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import "../../css/conference/paint.css";

const Paint = ({ groupId }) => {
  const store = useSyncDemo({ roomId: groupId });
  return (
    <div className="paint-container">
      <Tldraw
        store={store}
        className="tldraw-component"
        disableAssets={true} /* asset 도구 비활성화 */
      />
    </div>
  );
};

export default Paint;
