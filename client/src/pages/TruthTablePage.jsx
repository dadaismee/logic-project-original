import React, { useState, useEffect } from "react";
import { Row, Col, Divider, Button, Tooltip } from "antd";
import { ShareAltOutlined } from "@ant-design/icons";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useNavigate, useParams } from "react-router-dom";
import { post } from "axios";

import TableInput from "../components/TableInput";
import TruthTable from "../components/TruthTable";
import message from "../utils/message";
import encodeToURI from "../utils/encodeToURI";
import generateTable from "../utils/generateTable";
import isTableValid from "../utils/isTableValid";
import { VALUE_FORMAT } from "../config";

const LATEX_INPUT_TABEL = [{ tex: "\\wedge", oper: "v" }];

const TruthTablePage = () => {
  const { preform } = useParams();
  const [formula, setFormula] = useState("");
  const [loading, setLoading] = useState(false);
  const [col, setCol] = useState(null);
  const [data, setData] = useState(null);
  const [valueFormat, setValueFormat] = useState(VALUE_FORMAT[0]);
  const [formHistory, setFormHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (preform) {
      const decoded = decodeURIComponent(preform);
      handleClickFormula(decoded);
      navigate("/truth-table");
    }
  }, [preform]);

  const replaceLatexToSymbol = (input) => {
    let value = "";
    LATEX_INPUT_TABEL.forEach((latexObj) => {
      value = input.replace(latexObj.tex, latexObj.oper);
    });
    return value;
  };

  const handleChangeInput = (input) => {
    setFormula(replaceLatexToSymbol(input));
  };

  const handleRequest = (formulasRaw) => {
    setLoading(true);
    const formula = formulasRaw.split(",").map((f) => f.trim());

    post("http://127.0.0.1:5000/api/truthtable", { formula, valueFormat })
      .then((res) => {
        if (res.status === 500) return Promise.reject(res);
        return res;
      })
      .then(({ data }) => {
        const { table } = data;

        if (!isTableValid(table)) {
          return setData(false);
        }
        const formulasNum = formulasRaw.split(",").length;
        const { columns, dataSource } = generateTable(table, formulasNum);
        setCol(columns);
        setData(dataSource);

        if (!formHistory.includes(formulasRaw))
          setFormHistory([formulasRaw, ...formHistory]);
      })
      .catch(() => {
        setData(false);
      })
      .finally(() => setLoading(false));
  };

  const handleClickFormula = (selected) => {
    setFormula(selected);
    handleRequest(selected);
  };

  const handleChangeValueFormat = (e) => {
    setValueFormat(e.target.value);
  };

  return (
    <div className="truth-table-page">
      <div className="page__header">
        <h1 className="page__title">Truth tables</h1>
        <CopyToClipboard
          text={window.location.origin + "/truth-table/" + encodeToURI(formula)}
        >
          <Tooltip title="Share link to your table">
            <Button
              shape="circle"
              onClick={() => message("Link to the table copied!")}
              // className="with-icon-center"
              disabled={!data}
            >
              <ShareAltOutlined />
            </Button>
          </Tooltip>
        </CopyToClipboard>
      </div>
      <Divider />
      <Row>
        <Col span={9}>
          <TableInput
            formula={formula}
            valueFormat={valueFormat}
            handleChangeValueFormat={handleChangeValueFormat}
            setFormula={handleChangeInput}
            formHistory={formHistory}
            handleRequest={handleRequest}
            loading={loading}
            handleClickFormula={handleClickFormula}
          />
        </Col>
        <Col span={15}>
          <TruthTable dataSource={data} columns={col} />
        </Col>
      </Row>
    </div>
  );
};

export default TruthTablePage;
