import { navigate } from "./navigation";
import { CommandItem } from "./types";

export function execute(command: CommandItem) {

  if (command.disabled) {
    return;
  }

  if (command.route) {
    navigate(command.route);
    return;
  }

  command.run();

}





