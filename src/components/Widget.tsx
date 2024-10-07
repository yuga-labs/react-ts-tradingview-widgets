import React, { useEffect, useRef } from "react";
import Copyright, { CopyrightProps } from "./Copyright";

interface WidgetProps {
  scriptHTML: object;
  scriptSRC: string;
  containerId?: string;
  type?: "Widget" | "MediumWidget";
  copyrightProps: CopyrightProps;
}

declare const TradingView: any;

const Widget: React.FC<WidgetProps> = ({
  scriptHTML,
  scriptSRC,
  containerId,
  type,
  copyrightProps,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let refValue: HTMLDivElement;

    const initWidget = () => {
      if (ref.current) {
        const script = document.createElement("script");
        script.setAttribute("data-nscript", "afterInteractive");
        script.src = scriptSRC;
        script.async = true;
        script.type = "text/javascript";

        if (type === "Widget" || type === "MediumWidget") {
          script.onload = () => {
            if (typeof TradingView !== undefined) {
              console.log(scriptHTML);
              new TradingView.widget({
                container: containerId,
                ...scriptHTML,
              });
              // script.innerHTML = JSON.stringify(
              //   type === "Widget"
              //     ? new TradingView.widget({
              //         container: containerId,
              //         ...scriptHTML,
              //       })
              //     : type === "MediumWidget"
              //     ? new TradingView.MediumWidget(scriptHTML)
              //     : undefined
              // );
            }
          };
        } else {
          script.innerHTML = JSON.stringify(scriptHTML);
        }
        if (!ref.current.querySelector('script[src="' + scriptSRC + '"]')) {
          ref.current.appendChild(script);
        }
        refValue = ref.current;
      }
    };
    requestAnimationFrame(initWidget);

    return () => {
      if (refValue) {
        while (refValue.firstChild) {
          refValue.removeChild(refValue.firstChild);
        }
      }
    };
  }, [ref, scriptHTML, type, scriptSRC]);

  const containerKey = containerId || "tradingview_" + scriptHTML;

  return (
    <div style={{ display: "contents" }}>
      {type === "Widget" || type === "MediumWidget" ? (
        <div
          id={containerId}
          key={containerKey}
          style={{ display: "contents" }}
        >
          <div ref={ref} style={{ display: "contents" }} />
        </div>
      ) : (
        <div ref={ref} style={{ display: "contents" }} key={containerKey} />
      )}
      <Copyright
        href={copyrightProps.href}
        spanText={copyrightProps.spanText}
        text={copyrightProps.text}
        copyrightStyles={copyrightProps.copyrightStyles}
      />
    </div>
  );
};

export default Widget;
