import React, { useState } from "react";
import { PickerPanel } from "rc-picker";
import enUS from "rc-picker/es/locale/en_US";
import { Button, Popover } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import "antd/es/date-picker/style/css";

import "./datetime.css";

export function DateTime({ onDone, disabled }) {
  const [date, setDate] = useState(dayjs());
  const [show, setShow] = useState(false);
  return (
    <Popover
      content={
        <div>
          <PickerPanel
            value={date}
            locale={enUS}
            generateConfig={dayjsGenerateConfig}
            prefixCls="ant-picker"
            onPickerValueChange={(date) => {
              setDate(date);
            }}
          />
          <PickerPanel
            value={date}
            locale={enUS}
            generateConfig={dayjsGenerateConfig}
            prefixCls="ant-picker"
            mode="time"
            onPickerValueChange={(date) => {
              setDate(date);
            }}
          />
          <div
            style={{
              paddingTop: "8px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              onClick={() => {
                onDone(date);
                setShow(false);
              }}
            >
              Add Todo
            </Button>
          </div>
        </div>
      }
      trigger="click"
      placement="bottomRight"
      onVisibleChange={show => setShow(show)}
      visible={show}
    >
      <Button className="clockbutton" disabled={disabled} onClick={() => {
          if(!disabled)
            setShow(true)
      }}>
        <ClockCircleOutlined />
      </Button>
    </Popover>
  );
}
