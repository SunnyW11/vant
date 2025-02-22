import { createNamespace, addUnit } from '../utils';
import { preventDefault } from '../utils/dom/event';
import { TouchMixin } from '../mixins/touch';
import Icon from '../icon';

const [createComponent, bem] = createNamespace('rate');

function getRateStatus(value, index, allowHalf) {
  if (value >= index) {
    return 'full';
  }

  if (value + 0.5 >= index && allowHalf) {
    return 'half';
  }

  return 'void';
}

export default createComponent({
  mixins: [TouchMixin],

  props: {
    size: [Number, String],
    gutter: [Number, String],
    readonly: Boolean,
    disabled: Boolean,
    allowHalf: Boolean,
    value: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: 'star'
    },
    voidIcon: {
      type: String,
      default: 'star-o'
    },
    color: {
      type: String,
      default: '#ffd21e'
    },
    voidColor: {
      type: String,
      default: '#c7c7c7'
    },
    disabledColor: {
      type: String,
      default: '#bdbdbd'
    },
    count: {
      type: Number,
      default: 5
    }
  },

  computed: {
    list() {
      const list = [];
      for (let i = 1; i <= this.count; i++) {
        list.push(getRateStatus(this.value, i, this.allowHalf));
      }

      return list;
    },

    sizeWithUnit() {
      return addUnit(this.size);
    },

    gutterWithUnit() {
      return addUnit(this.gutter);
    }
  },

  methods: {
    select(index) {
      if (!this.disabled && !this.readonly && index !== this.value) {
        this.$emit('input', index);
        this.$emit('change', index);
      }
    },

    onTouchStart(event) {
      if (this.readonly || this.disabled) {
        return;
      }

      this.touchStart(event);

      const rects = this.$refs.items.map(item => item.getBoundingClientRect());
      const ranges = [];

      rects.forEach((rect, index) => {
        if (this.allowHalf) {
          ranges.push(
            { score: index + 0.5, left: rect.left },
            { score: index + 1, left: rect.left + rect.width / 2 }
          );
        } else {
          ranges.push({ score: index + 1, left: rect.left });
        }
      });

      this.ranges = ranges;
    },

    onTouchMove(event) {
      if (this.readonly || this.disabled) {
        return;
      }

      this.touchMove(event);

      if (this.direction === 'horizontal') {
        preventDefault(event);

        const { clientX } = event.touches[0];
        this.select(this.getScoreByPosition(clientX));
      }
    },

    getScoreByPosition(x) {
      for (let i = this.ranges.length - 1; i > 0; i--) {
        if (x > this.ranges[i].left) {
          return this.ranges[i].score;
        }
      }

      return this.allowHalf ? 0.5 : 1;
    },

    renderStar(status, index) {
      const { icon, color, count, voidIcon, disabled, voidColor, disabledColor } = this;
      const score = index + 1;
      const isFull = status === 'full';
      const isVoid = status === 'void';

      let style;
      if (this.gutterWithUnit && score !== count) {
        style = { paddingRight: this.gutterWithUnit };
      }

      return (
        <div
          ref="items"
          refInFor
          key={index}
          role="radio"
          style={style}
          tabindex="0"
          aria-setsize={count}
          aria-posinset={score}
          aria-checked={String(!isVoid)}
          class={bem('item')}
        >
          <Icon
            size={this.sizeWithUnit}
            name={isFull ? icon : voidIcon}
            class={bem('icon')}
            data-score={score}
            color={disabled ? disabledColor : isFull ? color : voidColor}
            onClick={() => {
              this.select(score);
            }}
          />
          {this.allowHalf && (
            <Icon
              size={this.sizeWithUnit}
              name={isVoid ? voidIcon : icon}
              class={bem('icon', 'half')}
              data-score={score - 0.5}
              color={disabled ? disabledColor : isVoid ? voidColor : color}
              onClick={() => {
                this.select(score - 0.5);
              }}
            />
          )}
        </div>
      );
    }
  },

  render() {
    return (
      <div
        class={bem()}
        tabindex="0"
        role="radiogroup"
        onTouchstart={this.onTouchStart}
        onTouchmove={this.onTouchMove}
      >
        {this.list.map((status, index) => this.renderStar(status, index))}
      </div>
    );
  }
});
