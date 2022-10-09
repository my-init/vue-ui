import { defineComponent } from "vue";
import "./index.less";

export enum ButtonType {
  Default = "default",
  Primary = "primary",
  Danger = "danger",
  Success = "success",
  Warning = "warning",
}

export enum ButtonSize {
    Big = 'big',
    Normal = 'normal',
    Small = 'small'
}

export const Button = defineComponent({
  name: "DemoButton",
  props: {
    type: {
      type: String,
      default: ButtonType.Default,
    },
    size: {
        type: String,
        default: ButtonSize.Normal,
      },
  },
  setup(props, { slots }) {
    return () => (
      <button class={["demo-button", 'demo-button--' + props.size, 'demo-button--' + props.type ]}>
        {slots.default?.()}
      </button>
    );
  },
});

export default Button;
