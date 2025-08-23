import { Input} from 'antd';
const { Search } = Input;

const AntdInput = ({holder,filterDoctors}) => {
    const onSearch = (value) => {
      filterDoctors(value)
    };
    return (
      <div style={{ padding: "20px", maxWidth: "350px" }}>
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