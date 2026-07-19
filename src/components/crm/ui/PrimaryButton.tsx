import { ButtonHTMLAttributes } from "react";

export default function PrimaryButton(
props: ButtonHTMLAttributes<HTMLButtonElement>
) {

return (

<button

{...props}

className="
rounded-2xl
bg-gradient-to-r
from-blue-700
via-blue-600
to-emerald-600
px-6
py-3
font-semibold
text-white
transition-all
duration-300
hover:scale-[1.03]
hover:shadow-xl
active:scale-95
disabled:opacity-60"

>

{props.children}

</button>

);

}