import { Input} from 'antd';
const { Search } = Input;

const AntdInput = ({holder}) => {
    const onSearch = (value) => console.log(value);
    return (
      <div style={{ padding: "20px", maxWidth: "400px" }}>
        <Search
      placeholder={holder}
      allowClear
      enterButton="Search"
      size="large"
      onSearch={onSearch}
    />
      </div>
    );
  };
  
  export default AntdInput;