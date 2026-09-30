import type { CanvasAddonMountContext } from "../generated/mywallpaper-runtime";
import { card, el } from "./ui";
import { timer } from "./timing";
import "./style.css";
export function mount(context: CanvasAddonMountContext) {
  const view = card(context, "Heure"),
    value = el("div", "", "number");
  view.body.append(value);
  let values = context.layer.settings.get();
  const render = () => {
    try {
      value.textContent = new Intl.DateTimeFormat(
        String(values.locale || "fr-FR"),
        {
          hour: "2-digit",
          minute: "2-digit",
          ...(values.seconds ? { second: "2-digit" } : {}),
          hour12: values.hour12 === true,
          ...(values.timezone ? { timeZone: String(values.timezone) } : {}),
        },
      ).format(new Date());
      view.caption.textContent = String(
        values.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      );
      view.caption.classList.remove("error");
    } catch {
      value.textContent = "—";
      view.caption.textContent = "Fuseau ou langue invalide";
      view.caption.classList.add("error");
    }
  };
  const stop = context.layer.settings.subscribe((next) => {
      values = next;
      render();
    }),
    stopTimer = timer(context, render);
  return () => {
    stop();
    stopTimer();
    view.section.remove();
  };
}
