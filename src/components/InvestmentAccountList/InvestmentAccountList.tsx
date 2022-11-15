import { useState } from 'react';
import styled from 'styled-components';

import { Table, TableContainer, Paper } from '@mui/material';

import { useGetAccountQuery } from '@src/components/InvestmentAccountList/Account-query/InvestmentAccount.query';
import usePrefetchAccountList from './hooks/usePrefetchAccountList';
import InvestmentAccountTableHead from './InvestmentAccountTableHead/InvestmentAccountTableHead';
import InvestmentAccountItem from './InvestmentAccountItem/InvestmentAccountItem';
import SearchInput from './component/SearchInput';
import Dropdown from './Dropdown/Dropdown';
import PagenationButton from './component/PagenationButton';
import { DROPDOWN_DATA } from '@src/constants/dropDownData';

const InvestmentAccountList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [accountQueryParams, setAccountQueryParams] = useState({
    keyword: '',
    broker_id: '',
    is_active: '',
    status: '',
    page_limit: `&_page=${currentPage}&_limit=20`,
  });

  const {
    data: defaultAccountListData,
    isLoading,
    isError,
  } = useGetAccountQuery(accountQueryParams, currentPage);

  // const maxPage = Math.floor(defaultAccountListData?.data?.length / 20) + 1;
  const maxPage = defaultAccountListData?.data?.length;
  const limit = 20;

  // usePrefetchAccountList(currentPage, maxPage);

  const handleCurrentPage = num => {
    setCurrentPage(prev => prev + num);
    setAccountQueryParams(prev => {
      return {
        ...prev,
        page_limit: `&_page=${currentPage + num}&_limit=20`,
      };
    });
  };

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>error...</h3>
      </>
    );

  return (
    <>
      <Container>
        <SearchInput
          accountQueryParams={accountQueryParams}
          setAccountQueryParams={setAccountQueryParams}
        />
        {DROPDOWN_DATA.map(({ id, name, data }) => (
          <Dropdown
            key={id}
            accountQueryParams={accountQueryParams}
            setAccountQueryParams={setAccountQueryParams}
            name={name}
            data={data}
          />
        ))}
      </Container>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <InvestmentAccountTableHead />
          <InvestmentAccountItem data={defaultAccountListData} />
        </Table>
      </TableContainer>
      <PagenationButton
        currentPage={currentPage}
        maxPage={maxPage}
        handleCurrentPage={handleCurrentPage}
      />
    </>
  );
};

export default InvestmentAccountList;

const Container = styled.div`
  ${({ theme }) => theme.flexDefault}
`;
