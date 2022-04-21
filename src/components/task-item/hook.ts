import { useEffect, useState } from "react";
import { commonConfig } from "../../helpers/jsPlumbConfig";
export const pointOverEvent = (barRef: any, jsPlumb: any, id: string) => {
  // 鼠标移入连接点时会触发barWrapper失去hover,从而导致barHandle和handleGroup消失，所以采用动态添加class的方式
  barRef.current.classList.add("barHover");
  // 鼠标移入连接点时，使另外一个连接节点也显示出来
  if (jsPlumb) {
    jsPlumb.selectEndpoints({ element: id }).addClass("endpoint-hover");
  }
};
export const pointOutEvent = (
  barRef: React.RefObject<Element>,
  jsPlumb: any,
  id: string
) => {
  barRef?.current?.classList.remove("barHover");
  if (jsPlumb) {
    jsPlumb.selectEndpoints({ element: id }).removeClass("endpoint-hover");
  }
};
export const barAnchor = {
  milestone: {
    Left: [0, 0.5, -1, 0, 5, 0, "Left"],
    Right: [1, 0.5, 1, 0, -2, 0, "Right"],
  },
  normal: {
    Left: [0, 0.5, -1, 0, 0, 0, "Left"],
    Right: [1, 0.5, 1, 0, 0, 0, "Right"],
  },
};
export const useHover = (
  barRef: React.RefObject<Element>,
  jsPlumb: any,
  id: string
): any => {
  useEffect((): any => {
    if (barRef.current) {
      const addHoverClass = () => {
        barRef?.current?.classList.add("barHover");
        if (jsPlumb) {
          jsPlumb.selectEndpoints({ element: id }).addClass("endpoint-hover");
        }
      };
      const removeHoverClass = () => {
        barRef?.current?.classList.remove("barHover");
        if (jsPlumb) {
          jsPlumb
            .selectEndpoints({ element: id })
            .removeClass("endpoint-hover");
        }
      };
      const nodeDom = barRef.current;
      nodeDom.addEventListener("mouseover", addHoverClass);
      nodeDom.addEventListener("mouseout", removeHoverClass);
      return () => {
        if (nodeDom) {
          nodeDom.removeEventListener("mouseover", addHoverClass);
          nodeDom.removeEventListener("mouseout", removeHoverClass);
        }
      };
    }
  }, [barRef, jsPlumb, id]);
};

export const useAddPoint = (
  jsPlumb: any,
  task: any,
  barRef: any,
  type?: string
) => {
  const [addPointFinished, setAddPointFinished] = useState(false);
  useEffect(() => {
    if (jsPlumb) {
      // 生成新节点删除旧节点时需设置setIdChanged
      jsPlumb.setIdChanged(task.id, task.id);
      const rightPoint = jsPlumb.addEndpoint(
        task.id,
        {
          anchor:
            type === "milestone"
              ? barAnchor.milestone.Right
              : barAnchor.normal.Right,
          uuid: task.id + "-Right",
        },
        commonConfig
      );
      rightPoint.bind("mouseover", () =>
        pointOverEvent(barRef, jsPlumb, task.id)
      );
      rightPoint.bind("mouseout", () =>
        pointOutEvent(barRef, jsPlumb, task.id)
      );
      const leftPoint = jsPlumb.addEndpoint(
        task.id,
        {
          anchor:
            type === "milestone"
              ? barAnchor.milestone.Left
              : barAnchor.normal.Left,
          uuid: task.id + "-Left",
        },
        commonConfig
      );
      leftPoint.bind("mouseover", () =>
        pointOverEvent(barRef, jsPlumb, task.id)
      );
      leftPoint.bind("mouseout", () => pointOutEvent(barRef, jsPlumb, task.id));
      setAddPointFinished(true);
    }
    return () => {
      if (jsPlumb) {
        jsPlumb.deleteEndpoint(task.id + "-Left");
        jsPlumb.deleteEndpoint(task.id + "-Right");
      }
    };
  }, [jsPlumb, task.y, barRef, task.id, type]);
  return addPointFinished;
};
