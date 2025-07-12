const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function addAdminUser() {
    try {
        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash('admin1234', 12);

        // 새로운 관리자 사용자 추가
        const newUser = await prisma.user.create({
            data: {
                username: 'admin',
                nickname: '김츄츄',
                password: hashedPassword,
                role: 'super_admin',
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        console.log('✅ 관리자 사용자가 성공적으로 추가되었습니다:');
        console.log('ID:', newUser.username);
        console.log('닉네임:', newUser.nickname);
        console.log('권한:', newUser.role);
        console.log('등록일:', newUser.createdAt);

    } catch (error) {
        if (error.code === 'P2002') {
            console.log('❌ 이미 존재하는 사용자명입니다.');
        } else {
            console.error('❌ 오류 발생:', error);
        }
    } finally {
        await prisma.$disconnect();
    }
}

addAdminUser(); 